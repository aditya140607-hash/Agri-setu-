import { Router } from 'express';
import { CropController } from '../controllers/crop.controller.js';
import { optionalAuthenticateJWT, authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/analyze', optionalAuthenticateJWT, CropController.analyze);
router.get('/history', optionalAuthenticateJWT, CropController.getHistory);
router.get('/guidance', CropController.getGuidance);
router.get('/', optionalAuthenticateJWT, CropController.getCrops);
router.post('/', authenticateJWT, CropController.addCrop);
router.delete('/:id', authenticateJWT, CropController.deleteCrop);

export default router;
