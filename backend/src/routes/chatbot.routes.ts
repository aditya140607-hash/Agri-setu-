import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbot.controller.js';
import { optionalAuthenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/message', optionalAuthenticateJWT, ChatbotController.sendMessage);
router.get('/history', optionalAuthenticateJWT, ChatbotController.getHistory);

export default router;
