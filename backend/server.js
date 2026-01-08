import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chatRoutes from './routes/chat.js';
import analyzeRoutes from './routes/analyze.js';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '.env') });

const app = express();

// CORS configuration for Vite dev server (allow both common ports)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Code Council API Server',
    status: 'running',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat',
      analyze: '/api/analyze'
    }
  });
});

// Health check endpoint (before other routes)
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    ts: new Date().toISOString(),
    version: '2.0.0'
  });
});

// API routes
try {
  app.use('/api', chatRoutes);
  console.log('[backend] ✓ Chat routes registered');
} catch (error) {
  console.error('[backend] ✗ Error registering chat routes:', error);
}

try {
  app.use('/api', analyzeRoutes);
  console.log('[backend] ✓ Analyze routes registered');
} catch (error) {
  console.error('[backend] ✗ Error registering analyze routes:', error);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[backend] Server running on port ${PORT}`);
  console.log(`[backend] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[backend] Available endpoints:`);
  console.log(`[backend]   GET  /api/health`);
  console.log(`[backend]   POST /api/chat`);
  console.log(`[backend]   POST /api/analyze`);
});