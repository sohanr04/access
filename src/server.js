import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sampleRoutes from './api/routes/sampleRoutes.js';
import { errorHandler, notFound } from './api/middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000'],
  credentials: true
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Increase JSON payload limit for image data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/samples', sampleRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Garment Samples API',
    version: '1.0.0',
    endpoints: {
      samples: {
        get: '/api/samples',
        getById: '/api/samples/:styleId',
        create: '/api/samples',
        update: '/api/samples/:styleId',
        delete: '/api/samples/:styleId'
      }
    }
  });
});

// Test route to check API health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Function to try different ports if the primary port is busy
const startServer = (port) => {
  try {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`API available at http://localhost:${port}/api`);
    });

    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying port ${port + 1}`);
        startServer(port + 1);
      } else {
        console.error('Server failed to start:', e);
      }
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

// Start the server
startServer(PORT);

export default app; 