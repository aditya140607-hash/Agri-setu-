import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller.js';
import { optionalAuthenticateJWT, authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

// Admin protected endpoints
router.get('/dashboard', authenticateJWT, requireRole('ADMIN'), AdminController.getDashboard);
router.get('/farmers', authenticateJWT, requireRole('ADMIN'), AdminController.getFarmers);
router.post('/schemes', authenticateJWT, requireRole('ADMIN'), AdminController.addScheme);
router.put('/schemes/:id', authenticateJWT, requireRole('ADMIN'), AdminController.updateScheme);
router.delete('/schemes/:id', authenticateJWT, requireRole('ADMIN'), AdminController.deleteScheme);
router.get('/analytics', authenticateJWT, requireRole('ADMIN'), AdminController.getAnalytics);

// Feedback endpoints
router.post('/feedback', optionalAuthenticateJWT, AdminController.submitFeedback);
router.get('/feedback', AdminController.getFeedbacks);

export default router;
