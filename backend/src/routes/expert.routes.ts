import { Router } from 'express';
import { ExpertController } from '../controllers/expert.controller.js';
import { optionalAuthenticateJWT, authenticateJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';

const router = Router();

router.get('/', optionalAuthenticateJWT, ExpertController.getExperts);
router.post('/request', optionalAuthenticateJWT, ExpertController.submitRequest);
router.get('/requests', optionalAuthenticateJWT, ExpertController.getRequests);
router.put('/requests/:id/reply', authenticateJWT, requireRole('EXPERT', 'ADMIN'), ExpertController.replyRequest);

export default router;
