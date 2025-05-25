import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { EnhanceRequestSchema, TOPAZ_MODELS, type TopazEnhanceResponse, type TopazStatusResponse } from '../types/topaz';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and TIFF are allowed.'));
    }
  }
});

const TOPAZ_BASE_URL = 'https://api.topazlabs.com';

// POST /api/enhance - Start enhancement process
router.post('/enhance', upload.single('image'), async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? 'File present' : 'No file');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Validate request body
    const validation = EnhanceRequestSchema.safeParse(req.body);
    if (!validation.success) {
      console.log('Validation errors:', validation.error.errors);
      return res.status(400).json({ 
        error: 'Invalid parameters', 
        details: validation.error.errors 
      });
    }

    const { preset, detail, scale } = validation.data;

    // Prepare form data for Topaz API
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Map our parameters to Topaz API format
    const model = TOPAZ_MODELS[preset];
    formData.append('model', model);
    formData.append('sharpen', detail.toString());
    
    // Calculate output dimensions based on scale
    const baseHeight = 1024;
    formData.append('output_height', (baseHeight * scale).toString());

    console.log('Calling Topaz API with:', {
      model,
      sharpen: detail.toString(),
      output_height: (baseHeight * scale).toString(),
      filename: req.file.originalname
    });

    // Call Topaz API - corrected endpoint
    const apiUrl = `${TOPAZ_BASE_URL}/image/v1/enhance/async`;
    console.log('API URL:', apiUrl);
    
    console.log('API Key present:', !!process.env.TOPAZ_API_KEY);
    console.log('API Key length:', process.env.TOPAZ_API_KEY?.length);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.TOPAZ_API_KEY!,
        ...formData.getHeaders()
      },
      body: formData
    });

    console.log('Topaz API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Topaz API error response:', errorText);
      throw new Error(`Topaz API error: ${response.status} ${errorText}`);
    }

    const result = await response.json() as TopazEnhanceResponse;
    console.log('Topaz API success response:', result);

    // Map the response to match our frontend expectations
    const mappedResult = {
      processId: result.process_id,  // Map process_id to processId
      eta: result.eta
    };

    res.json(mappedResult);

  } catch (error) {
    console.log('API Error:', error);
    next(error);
  }
});

// GET /api/status/:processId - Check enhancement status
router.get('/status/:processId', async (req, res, next) => {
  try {
    const { processId } = req.params;
    
    if (!processId || processId.length < 10) {
      return res.status(400).json({ error: 'Invalid process ID format' });
    }
    
    console.log('Checking status for processId:', processId);

    const statusUrl = `${TOPAZ_BASE_URL}/image/v1/status/${processId}`;
    console.log('Status URL:', statusUrl);

    const response = await fetch(statusUrl, {
      headers: {
        'X-API-Key': process.env.TOPAZ_API_KEY!
      }
    });

    console.log('Status check response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Status check error response:', errorText);
      throw new Error(`Topaz API error: ${response.status} ${errorText}`);
    }

    const result = await response.json() as any;
    console.log('Status check success response:', result);
    
    // Map Topaz status to our expected format
    const mappedResult = {
      state: result.status === 'Completed' ? 'done' : 
             result.status === 'Processing' ? 'processing' : 
             result.status === 'Failed' ? 'failed' : 'pending',
      progress: result.progress || 0,
      // Add additional info for completed jobs
      ...(result.status === 'Completed' && {
        output_width: result.output_width,
        output_height: result.output_height,
        output_format: result.output_format,
        credits: result.credits
      })
    };
    
    res.json(mappedResult);

  } catch (error) {
    console.log('Status check error:', error);
    next(error);
  }
});

// GET /api/download/:processId - Download enhanced image
router.get('/download/:processId', async (req, res, next) => {
  try {
    const { processId } = req.params;
    console.log('Downloading for processId:', processId);

    // Correct Topaz API download endpoint
    const downloadUrl = `${TOPAZ_BASE_URL}/image/v1/download/${processId}`;
    console.log('Download URL:', downloadUrl);

    const response = await fetch(downloadUrl, {
      headers: {
        'X-API-Key': process.env.TOPAZ_API_KEY!
      }
    });

    console.log('Download response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Download error response:', errorText);
      throw new Error(`Topaz API error: ${response.status} ${errorText}`);
    }

    // Parse the JSON response to get the presigned URL
    const downloadInfo = await response.json() as { download_url: string; expires: number };
    console.log('Download info:', downloadInfo);

    // Now fetch the actual image from the presigned URL
    const imageResponse = await fetch(downloadInfo.download_url, {
      redirect: 'follow'
    });

    console.log('Image response status:', imageResponse.status);

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.log('Image download error:', errorText);
      throw new Error(`Image download failed: ${imageResponse.status} ${errorText}`);
    }

    // Stream the actual image back to client
    res.setHeader('Content-Type', imageResponse.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Content-Length', imageResponse.headers.get('content-length') || '');
    
    // Add CORS headers if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    imageResponse.body?.pipe(res);

  } catch (error) {
    console.log('Download error:', error);
    next(error);
  }
});

export { router as enhanceRouter }; 