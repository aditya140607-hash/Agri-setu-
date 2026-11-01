import { Response } from 'express';
import { db, Crop, CropAnalysis } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { AIService } from '../services/ai.service.js';

export class CropController {
  static async analyze(req: AuthenticatedRequest, res: Response) {
    try {
      const { image, cropNameHint, mimeType } = req.body;

      if (!image) {
        return res.status(400).json({ success: false, message: 'Image data is required (base64 string or data URL).' });
      }

      const farmerId = req.user ? req.user.id : 'usr-farmer-01';

      // Call AI vision service
      const analysisResult = await AIService.analyzeCropImage(image, mimeType || 'image/jpeg', cropNameHint);

      // Persist analysis in database
      const newAnalysis: CropAnalysis = {
        id: `analysis-${Date.now()}`,
        farmerId,
        imageUrl: image.startsWith('http') ? image : image.substring(0, 500) + '...[base64]',
        cropName: analysisResult.cropName,
        detectedIssue: analysisResult.detectedIssue,
        confidence: analysisResult.confidence,
        symptoms: analysisResult.symptoms,
        recommendations: analysisResult.recommendations,
        chemicalControl: analysisResult.chemicalControl,
        biologicalControl: analysisResult.biologicalControl,
        needsExpertReview: analysisResult.needsExpertReview,
        createdAt: new Date().toISOString(),
      };

      db.cropAnalyses.unshift(newAnalysis);

      // Also trigger a farmer notification if severe disease detected
      if (analysisResult.confidence > 75 && !analysisResult.detectedIssue.toLowerCase().includes('healthy')) {
        db.notifications.unshift({
          id: `notif-${Date.now()}`,
          farmerId,
          title: `Crop Alert: ${analysisResult.cropName} - ${analysisResult.detectedIssue}`,
          message: `Diagnostic complete with ${analysisResult.confidence}% confidence. Follow the recommended spray schedule.`,
          type: 'CROP_HEALTH',
          link: '/crop-detection',
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }

      return res.json({
        success: true,
        message: 'Crop analysis completed successfully.',
        data: newAnalysis,
      });
    } catch (err: any) {
      console.error('Crop analysis error:', err);
      return res.status(500).json({ success: false, message: 'Error processing crop analysis.' });
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user ? req.user.id : 'usr-farmer-01';
    const history = db.cropAnalyses.filter((a) => a.farmerId === farmerId);
    return res.json({ success: true, data: history });
  }

  static async getGuidance(req: AuthenticatedRequest, res: Response) {
    const crop = (req.query.crop as string) || 'Wheat';
    const season = (req.query.season as string) || 'Rabi';
    const location = (req.query.location as string) || 'Central India';

    const guidance = await AIService.getCropGuidance(crop, season, location);
    return res.json({ success: true, data: guidance });
  }

  static async getCrops(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user ? req.user.id : 'usr-farmer-01';
    const crops = db.crops.filter((c) => c.farmerId === farmerId);
    return res.json({ success: true, data: crops });
  }

  static async addCrop(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user ? req.user.id : 'usr-farmer-01';
    const { cropName, variety, season, sowingDate, expectedHarvestDate, areaAcres } = req.body;

    if (!cropName) {
      return res.status(400).json({ success: false, message: 'Crop name is required.' });
    }

    const newCrop: Crop = {
      id: `crop-${Date.now()}`,
      farmerId,
      cropName,
      variety: variety || '',
      season: season || 'Kharif',
      sowingDate: sowingDate || new Date().toISOString(),
      expectedHarvestDate: expectedHarvestDate || undefined,
      areaAcres: Number(areaAcres) || 1.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.crops.push(newCrop);

    return res.status(201).json({
      success: true,
      message: 'Crop added to your farm records.',
      data: newCrop,
    });
  }

  static async deleteCrop(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const farmerId = req.user?.id;

    const index = db.crops.findIndex((c) => c.id === id && (c.farmerId === farmerId || req.user?.role === 'ADMIN'));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Crop record not found.' });
    }

    db.crops.splice(index, 1);
    return res.json({ success: true, message: 'Crop record deleted.' });
  }
}
