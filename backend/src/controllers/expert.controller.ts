import { Response } from 'express';
import { db, ExpertRequest } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class ExpertController {
  static async getExperts(req: AuthenticatedRequest, res: Response) {
    const { specialization } = req.query;
    let list = [...db.expertProfiles];

    if (specialization) {
      list = list.filter((e) => e.specialization.toLowerCase().includes(String(specialization).toLowerCase()));
    }

    return res.json({ success: true, total: list.length, data: list });
  }

  static async submitRequest(req: AuthenticatedRequest, res: Response) {
    const farmer = req.user;
    const { cropName, question, expertId, imageUrl } = req.body;

    if (!question || !cropName) {
      return res.status(400).json({ success: false, message: 'Crop name and question details are required.' });
    }

    const newRequest: ExpertRequest = {
      id: `req-${Date.now()}`,
      farmerId: farmer ? farmer.id : 'usr-farmer-01',
      farmerName: farmer ? farmer.fullName : 'Rameshwar Patil',
      farmerPhone: farmer ? farmer.mobileNumber : '9876543210',
      expertId: expertId || 'exp-01',
      cropName,
      question,
      imageUrl: imageUrl || undefined,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.expertRequests.unshift(newRequest);

    return res.status(201).json({
      success: true,
      message: 'Your query has been submitted to Krishi Vigyan Kendra expert scientist.',
      data: newRequest,
    });
  }

  static async getRequests(req: AuthenticatedRequest, res: Response) {
    const user = req.user;
    let requests = [...db.expertRequests];

    if (user && user.role === 'FARMER') {
      requests = requests.filter((r) => r.farmerId === user.id);
    } else if (user && user.role === 'EXPERT') {
      const expertProf = db.expertProfiles.find((e) => e.userId === user.id);
      if (expertProf) {
        requests = requests.filter((r) => !r.expertId || r.expertId === expertProf.id);
      }
    }

    return res.json({ success: true, data: requests });
  }

  static async replyRequest(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ success: false, message: 'Reply text is required.' });
    }

    const request = db.expertRequests.find((r) => r.id === id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Expert request not found.' });
    }

    request.expertReply = reply;
    request.status = 'RESOLVED';
    request.updatedAt = new Date().toISOString();

    // Trigger notification to farmer
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      farmerId: request.farmerId,
      title: `Expert Reply: ${request.cropName} Advisory`,
      message: `KVK Scientist has reviewed your query: "${reply.substring(0, 80)}..."`,
      type: 'CROP_HEALTH',
      link: '/experts',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return res.json({
      success: true,
      message: 'Resolution submitted to farmer.',
      data: request,
    });
  }
}
