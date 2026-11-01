import { Response } from 'express';
import { db, ChatMessage } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { AIService } from '../services/ai.service.js';

export class ChatbotController {
  static async sendMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const { message, language } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({ success: false, message: 'Message content is required.' });
      }

      const farmer = req.user;
      const farmerId = farmer ? farmer.id : 'usr-farmer-01';
      const lang = (language === 'EN' ? 'EN' : 'HI') as 'EN' | 'HI';

      const profile = farmer ? db.farmerProfiles.find((p) => p.userId === farmer.id) : null;
      const crops = farmer ? db.crops.filter((c) => c.farmerId === farmer.id).map((c) => c.cropName) : [];

      const farmerContext = {
        name: farmer ? farmer.fullName : 'Kisan Bhai',
        location: profile ? `${profile.district}, ${profile.state}` : 'India',
        landSize: profile?.landSize,
        crops,
        soilType: profile?.soilType,
      };

      const aiReply = await AIService.chatWithAssistant(message, lang, farmerContext);

      const chatRecord: ChatMessage = {
        id: `chat-${Date.now()}`,
        farmerId,
        message,
        response: aiReply,
        language: lang,
        createdAt: new Date().toISOString(),
      };

      db.chatMessages.push(chatRecord);

      return res.json({
        success: true,
        data: chatRecord,
      });
    } catch (err: any) {
      console.error('Chatbot error:', err);
      return res.status(500).json({ success: false, message: 'Error processing chatbot query.' });
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user ? req.user.id : 'usr-farmer-01';
    const history = db.chatMessages.filter((c) => c.farmerId === farmerId).slice(-30);

    return res.json({
      success: true,
      data: history,
    });
  }
}
