import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { enhanceRouter } from './routes/enhance';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-url.vercel.app'] // Update with your actual Vercel URL
    : ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});

// API routes
app.use('/api', enhanceRouter);

// Add a catch-all route for debugging
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found', 
    method: req.method, 
    path: req.originalUrl,
    availableRoutes: [
      'GET /api/health',
      'POST /api/enhance',
      'GET /api/status/:processId',
      'GET /api/download/:processId'
    ]
  });
});

// Error handling middleware
app.use(errorHandler);

// For Vercel serverless functions
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Enhance endpoint: http://localhost:${PORT}/api/enhance`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 Topaz API Key: ${process.env.TOPAZ_API_KEY ? 'Configured' : 'Missing'}`);
  });
} 