import './utils/polyfills.js';
import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import { ensureConnected, databaseStatus } from './config/database.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import { candidatePortalRouter, candidatesManagementRouter } from './routes/candidate.routes.js';
import jobRoutes from './routes/job.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import leaveRoutes from './routes/leave.routes.js';
import aiRoutes from './routes/ai.routes.js';
import policyRoutes from './routes/policy.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import settingsController from './controllers/settings.controller.js';

// Middleware imports
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

const app = express();

// 1. CORS Configuration
const allowedOrigins = [
  config.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean).map(url => url.replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 2. Body Parser
app.use(express.json());

// 3. Database Readiness Middleware (required on Vercel serverless)
app.use(async (req, res, next) => {
  const isHealthRoute = req.path === '/' || req.path === '/api' || req.path === '/api/db-status';
  if (isHealthRoute) return next();

  const connected = await ensureConnected();
  if (!connected && req.path.startsWith('/api')) {
    return res.status(503).json({
      error: 'Database unavailable. Set MONGODB_URI in Vercel environment variables.',
      details: databaseStatus.connectionError
    });
  }
  next();
});

// 4. Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// 5. Health & Status Endpoints
app.get('/', async (req, res) => {
  await ensureConnected();
  const rawUri = config.MONGODB_URI || '';
  const maskedUri = rawUri.replace(/(mongodb\+srv:\/\/[^:]+:)[^@]+@/, '$1****@');
  res.json({
    message: 'SmartHRMS API is running successfully.',
    status: databaseStatus.isMongoConnected ? 'healthy' : 'degraded',
    isMongoConnected: databaseStatus.isMongoConnected,
    connectionError: databaseStatus.connectionError,
    mongoUriMasked: maskedUri || null,
    timestamp: new Date()
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the SmartHRMS Backend API.',
    version: '1.0.0'
  });
});

app.get('/api/db-status', settingsController.getDbStatus);

// 6. API Route Registrations
app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidatePortalRouter);
app.use('/api/candidates', candidatesManagementRouter);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/settings', settingsRoutes);

// 7. 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
