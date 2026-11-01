import { Router } from 'express';
import { InsuranceController } from '../controllers/insurance.controller.js';

const router = Router();

router.get('/schemes', InsuranceController.getSchemes);
router.get('/guidance', InsuranceController.getGuidance);

export default router;
