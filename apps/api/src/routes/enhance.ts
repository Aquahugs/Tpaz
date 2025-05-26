import express from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { EnhanceRequestSchema, TOPAZ_MODELS, type TopazEnhanceResponse, type TopazStatusResponse } from '../types/topaz';
import '../types/global'; // Import global type declarations

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, TIFF, and WebP are allowed.'));
    }
  }
});

const TOPAZ_BASE_URL = 'https://api.topazlabs.com';

// Simple in-memory cache (replace with Redis in production)
const imageCache: Record<string, {
  buffer: Buffer;
  contentType: string;
  ready: boolean;
}> = {};

// POST /enhance - Start enhancement process
router.post('/enhance', upload.single('image'), async (req, res, next) => {
  try {
    console.log('=== ENHANCE REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');
    console.log('Topaz API Key:', process.env.TOPAZ_API_KEY ? 'Present' : 'Missing');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!process.env.TOPAZ_API_KEY) {
      return res.status(500).json({ error: 'Topaz API key not configured' });
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
    formData.append('scale', scale.toString());

    console.log('Sending request to Topaz API...');
    console.log('Model:', model);
    console.log('Sharpen:', detail);
    console.log('Scale:', scale);

    // Send request to Topaz API
    const response = await fetch(`${TOPAZ_BASE_URL}/image/v1/enhance`, {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.TOPAZ_API_KEY
      },
      body: formData
    });

    console.log('Topaz API response status:', response.status);
    console.log('Topaz API response content-type:', response.headers.get('content-type'));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Topaz API error response:', errorText);
      throw new Error(`Topaz API error: ${response.status} ${errorText}`);
    }

    // Check if the response is JSON (async processing) or image (direct processing)
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // Async processing - return process ID
      const result = await response.json() as TopazEnhanceResponse;
      console.log('Topaz API success response (async):', result);

      res.json({
        processId: result.process_id,
        eta: result.eta
      });
    } else if (contentType.includes('image/')) {
      // Direct processing - image is ready immediately
      console.log('Topaz API returned image directly');
      
      // Generate a fake process ID for consistency
      const fakeProcessId = `direct_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Get the image buffer
      const imageBuffer = await response.buffer();
      
      // Store in cache
      imageCache[fakeProcessId] = {
        buffer: imageBuffer,
        contentType: contentType,
        ready: true
      };

      res.json({
        processId: fakeProcessId,
        eta: 0, // Image is ready immediately
        status: 'completed'
      });
    } else {
      throw new Error(`Unexpected response content type: ${contentType}`);
    }

  } catch (error) {
    console.error('Enhancement error:', error);
    next(error);
  }
});

// GET /status/:processId - Check enhancement status
router.get('/status/:processId', async (req, res, next) => {
  try {
    const { processId } = req.params;
    console.log('Checking status for processId:', processId);

    // Check if this is a direct processing result
    if (processId.startsWith('direct_')) {
      const cached = imageCache[processId];
      if (cached) {
        return res.json({
          state: 'done',
          progress: 100,
          status: 'completed'
        });
      } else {
        return res.status(404).json({ error: 'Process not found' });
      }
    }

    if (!process.env.TOPAZ_API_KEY) {
      return res.status(500).json({ error: 'Topaz API key not configured' });
    }

    const response = await fetch(`${TOPAZ_BASE_URL}/image/v1/status/${processId}`, {
      headers: {
        'X-API-Key': process.env.TOPAZ_API_KEY
      }
    });

    console.log('Status response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Status error response:', errorText);
      throw new Error(`Topaz API error: ${response.status} ${errorText}`);
    }

    const status = await response.json() as TopazStatusResponse;
    console.log('Status response:', status);

    res.json(status);

  } catch (error) {
    console.log('Status error:', error);
    next(error);
  }
});

// GET /download/:processId - Download enhanced image
router.get('/download/:processId', async (req, res, next) => {
  try {
    const { processId } = req.params;
    console.log('Downloading for processId:', processId);

    // Check if this is a direct processing result
    if (processId.startsWith('direct_')) {
      const cached = imageCache[processId];
      if (cached) {
        res.setHeader('Content-Type', cached.contentType);
        res.setHeader('Content-Length', cached.buffer.length.toString());
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.send(cached.buffer);
      } else {
        return res.status(404).json({ error: 'Image not found' });
      }
    }

    if (!process.env.TOPAZ_API_KEY) {
      return res.status(500).json({ error: 'Topaz API key not configured' });
    }

    // Get download URL from Topaz API
    const downloadUrl = `${TOPAZ_BASE_URL}/image/v1/download/${processId}`;
    console.log('Download URL:', downloadUrl);

    const response = await fetch(downloadUrl, {
      headers: {
        'X-API-Key': process.env.TOPAZ_API_KEY
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
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    imageResponse.body?.pipe(res);

  } catch (error) {
    console.log('Download error:', error);
    next(error);
  }
});

export { router as enhanceRouter };