import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import statesRoutes from './routes/states.js';
import alphaBetaRoutes from './routes/alphabeta.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.BACKEND_PORT || 15011;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:15012',
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DSA Virtual Lab API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'DSA Virtual Lab API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me',
        update: 'PUT /api/auth/update',
      },
      states: {
        list: 'GET /api/states',
        get: 'GET /api/states/:id',
        create: 'POST /api/states',
        update: 'PUT /api/states/:id',
        delete: 'DELETE /api/states/:id',
        latest: 'GET /api/states/user/latest',
      },
      alphabeta: {
        scores: 'GET /api/alphabeta/scores',
        saveScore: 'POST /api/alphabeta/scores',
        getScore: 'GET /api/alphabeta/scores/:id',
        stats: 'GET /api/alphabeta/stats',
      },
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/states', statesRoutes);
app.use('/api/alphabeta', alphaBetaRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:15012'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});
