import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { enhanceRouter } from './routes/enhance';

const app = express();

// Configure CORS for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://topaz-image-enhancement.vercel.app'] // Your actual Vercel URL
    : ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

app.use('/api/enhance', upload.single('image'), enhanceRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// For Vercel serverless functions
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}`);
  });
} 