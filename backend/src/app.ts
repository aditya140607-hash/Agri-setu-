import express from 'express';
import authRoutes from './routes/auth.routes.js';
import farmerRoutes from './routes/farmer.routes.js';
import cropRoutes from './routes/crop.routes.js';
import schemeRoutes from './routes/scheme.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import mandiRoutes from './routes/mandi.routes.js';
import insuranceRoutes from './routes/insurance.routes.js';
import expertRoutes from './routes/expert.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

export function createApp() {
  const app = express();

  // Middleware for body parsing (allowing image uploads up to 25MB)
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'UP',
      platform: 'AGRI-SETU Smart Agriculture Support Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Route Mounts
  app.use('/api/auth', authRoutes);
  app.use('/api/farmers', farmerRoutes);
  app.use('/api/crops', cropRoutes);
  app.use('/api/schemes', schemeRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/mandi', mandiRoutes);
  app.use('/api/insurance', insuranceRoutes);
  app.use('/api/experts', expertRoutes);
  app.use('/api/chatbot', chatbotRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/admin', adminRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
