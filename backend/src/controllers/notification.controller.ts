import { Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class NotificationController {
  static async getAll(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user ? req.user.id : 'usr-farmer-01';
    const notifs = db.notifications.filter((n) => n.farmerId === farmerId);

    return res.json({
      success: true,
      data: notifs,
      unreadCount: notifs.filter((n) => !n.isRead).length,
    });
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const farmerId = req.user ? req.user.id : 'usr-farmer-01';

    const notif = db.notifications.find((n) => n.id === id && n.farmerId === farmerId);
    if (notif) {
      notif.isRead = true;
    }

    return res.json({ success: true, message: 'Notification marked as read.' });
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user ? req.user.id : 'usr-farmer-01';

    db.notifications
      .filter((n) => n.farmerId === farmerId)
      .forEach((n) => {
        n.isRead = true;
      });

    return res.json({ success: true, message: 'All notifications marked as read.' });
  }
}
