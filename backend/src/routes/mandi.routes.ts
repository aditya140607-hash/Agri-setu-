import { Router } from 'express';
import { MandiController } from '../controllers/mandi.controller.js';

const router = Router();

router.get('/prices', MandiController.getPrices);
router.get('/compare', MandiController.compare);
router.get('/history', MandiController.getHistory);

export default router;
