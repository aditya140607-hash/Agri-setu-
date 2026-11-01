import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { optionalAuthenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', optionalAuthenticateJWT, NotificationController.getAll);
router.put('/:id/read', optionalAuthenticateJWT, NotificationController.markAsRead);
router.put('/read-all', optionalAuthenticateJWT, NotificationController.markAllAsRead);

export default router;
