import { Router } from 'express';
import { SchemeController } from '../controllers/scheme.controller.js';
import { optionalAuthenticateJWT, authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', SchemeController.getAll);
router.get('/advisory', SchemeController.getAdvisory);
router.get('/saved', optionalAuthenticateJWT, SchemeController.getSaved);
router.get('/:id', SchemeController.getById);
router.post('/check-eligibility', SchemeController.checkEligibility);
router.post('/save', optionalAuthenticateJWT, SchemeController.saveScheme);
router.delete('/save/:schemeId', optionalAuthenticateJWT, SchemeController.unsaveScheme);

export default router;
