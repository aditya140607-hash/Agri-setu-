import { Response } from 'express';
import { db } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class FarmerController {
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    const user = req.user!;
    const profile = db.farmerProfiles.find((p) => p.userId === user.id);

    return res.json({
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
        profile: profile || null,
      },
    });
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    const user = req.user!;
    const { fullName, email, preferredLanguage, state, district, village, landSize, soilType, irrigation } = req.body;

    if (fullName) user.fullName = fullName;
    if (email !== undefined) user.email = email || null;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    user.updatedAt = new Date().toISOString();

    let profile = db.farmerProfiles.find((p) => p.userId === user.id);
    if (!profile) {
      profile = {
        id: `prof-${Date.now()}`,
        userId: user.id,
        state: state || 'Maharashtra',
        district: district || 'Nashik',
        village: village || '',
        landSize: Number(landSize) || 2.0,
        soilType: soilType || 'Alluvial',
        irrigation: irrigation || 'Rainfed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.farmerProfiles.push(profile);
    } else {
      if (state) profile.state = state;
      if (district) profile.district = district;
      if (village) profile.village = village;
      if (landSize !== undefined) profile.landSize = Number(landSize);
      if (soilType) profile.soilType = soilType;
      if (irrigation) profile.irrigation = irrigation;
      profile.updatedAt = new Date().toISOString();
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        ...user,
        profile,
      },
    });
  }

  static async getDashboard(req: AuthenticatedRequest, res: Response) {
    const user = req.user!;
    const profile = db.farmerProfiles.find((p) => p.userId === user.id);
    const crops = db.crops.filter((c) => c.farmerId === user.id);
    const savedSchemeIds = db.savedSchemes.filter((s) => s.farmerId === user.id).map((s) => s.schemeId);
    const savedSchemes = db.governmentSchemes.filter((s) => savedSchemeIds.includes(s.id));
    const recentAnalyses = db.cropAnalyses.filter((a) => a.farmerId === user.id).slice(-3);
    const notifications = db.notifications.filter((n) => n.farmerId === user.id);
    const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

    // Pick relevant weather
    const userDistrict = profile?.district || 'Nashik';
    let weather = db.weatherRecords.find((w) => w.district.toLowerCase().includes(userDistrict.toLowerCase()));
    if (!weather) {
      weather = db.weatherRecords[0];
    }

    // Pick relevant mandi prices for farmer's crops or region
    let mandiPrices = db.mandiPrices.filter((mp) => {
      const matchDistrict = profile ? mp.district.toLowerCase() === profile.district.toLowerCase() : true;
      const matchCrop = crops.some((c) => mp.cropName.toLowerCase().includes(c.cropName.toLowerCase().split(' ')[0]));
      return matchDistrict || matchCrop;
    });

    if (mandiPrices.length === 0) {
      mandiPrices = db.mandiPrices.slice(0, 5);
    }

    // Recommended schemes based on land size and crops
    const recommendedSchemes = db.governmentSchemes.slice(0, 4);

    return res.json({
      success: true,
      data: {
        farmer: {
          id: user.id,
          fullName: user.fullName,
          mobileNumber: user.mobileNumber,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          profile: profile || null,
        },
        crops,
        weather,
        mandiPrices,
        savedSchemes,
        recommendedSchemes,
        recentAnalyses,
        notifications: notifications.slice(0, 5),
        unreadNotificationsCount,
      },
    });
  }
}
