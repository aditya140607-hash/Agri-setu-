import { Router } from 'express';
import { FarmerController } from '../controllers/farmer.controller.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/profile', authenticateJWT, FarmerController.getProfile);
router.put('/profile', authenticateJWT, FarmerController.updateProfile);
router.get('/dashboard', authenticateJWT, FarmerController.getDashboard);

export default router;
