import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('API Error:', error);

  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ error: error.message });
  }

  if (error.message.includes('File too large')) {
    return res.status(413).json({ error: 'File size exceeds 50MB limit' });
  }

  if (error.message.includes('Topaz API error')) {
    return res.status(502).json({ error: 'External service error', details: error.message });
  }

  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
} 