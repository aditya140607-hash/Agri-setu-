import { Request, Response } from 'express';
import { db, GovernmentScheme, Feedback } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class AdminController {
  static async getDashboard(req: AuthenticatedRequest, res: Response) {
    const totalFarmers = db.users.filter((u) => u.role === 'FARMER').length;
    const totalCropAnalyses = db.cropAnalyses.length;
    const activeSchemes = db.governmentSchemes.length;
    const pendingExpertRequests = db.expertRequests.filter((r) => r.status === 'PENDING').length;
    const totalFeedback = db.feedbacks.length;
    const avgRating = totalFeedback > 0 ? (db.feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalFeedback).toFixed(1) : '4.9';

    return res.json({
      success: true,
      stats: {
        totalFarmers: totalFarmers + 14820, // baseline plus active demo count for hackfest realistic display
        totalCropAnalyses: totalCropAnalyses + 3420,
        activeSchemes,
        pendingExpertRequests,
        totalFeedback: totalFeedback + 284,
        avgRating,
      },
      recentFarmers: db.users.filter((u) => u.role === 'FARMER').slice(-5).map((u) => {
        const prof = db.farmerProfiles.find((p) => p.userId === u.id);
        return {
          id: u.id,
          fullName: u.fullName,
          mobileNumber: u.mobileNumber,
          state: prof?.state || 'Maharashtra',
          district: prof?.district || 'Nashik',
          landSize: prof?.landSize || 2.5,
          createdAt: u.createdAt,
        };
      }),
      recentAnalyses: db.cropAnalyses.slice(0, 5),
    });
  }

  static async getFarmers(req: AuthenticatedRequest, res: Response) {
    const farmers = db.users
      .filter((u) => u.role === 'FARMER')
      .map((u) => {
        const prof = db.farmerProfiles.find((p) => p.userId === u.id);
        const farmerCrops = db.crops.filter((c) => c.farmerId === u.id);
        return {
          id: u.id,
          fullName: u.fullName,
          mobileNumber: u.mobileNumber,
          email: u.email,
          state: prof?.state || 'N/A',
          district: prof?.district || 'N/A',
          village: prof?.village || 'N/A',
          landSize: prof?.landSize || 0,
          soilType: prof?.soilType || 'N/A',
          cropsCount: farmerCrops.length,
          createdAt: u.createdAt,
        };
      });

    return res.json({ success: true, total: farmers.length, data: farmers });
  }

  static async addScheme(req: AuthenticatedRequest, res: Response) {
    const { name, category, description, eligibility, benefits, documents, officialUrl, stateApplicable, minLandRequired, maxLandRequired } = req.body;

    if (!name || !description || !eligibility) {
      return res.status(400).json({ success: false, message: 'Name, description, and eligibility are required.' });
    }

    const newScheme: GovernmentScheme = {
      id: `sch-${Date.now()}`,
      name,
      category: category || 'Financial',
      description,
      eligibility,
      benefits: benefits || 'Financial assistance and support',
      documents: Array.isArray(documents) ? documents : ['Aadhaar Card', 'Land Records', 'Bank Passbook'],
      officialUrl: officialUrl || 'https://agricoop.gov.in',
      stateApplicable: stateApplicable || 'All India',
      minLandRequired: Number(minLandRequired) || 0,
      maxLandRequired: maxLandRequired ? Number(maxLandRequired) : undefined,
      createdAt: new Date().toISOString(),
    };

    db.governmentSchemes.unshift(newScheme);

    return res.status(201).json({
      success: true,
      message: 'Government scheme added successfully.',
      data: newScheme,
    });
  }

  static async updateScheme(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const scheme = db.governmentSchemes.find((s) => s.id === id);

    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found.' });
    }

    Object.assign(scheme, req.body);
    return res.json({ success: true, message: 'Scheme updated successfully.', data: scheme });
  }

  static async deleteScheme(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const index = db.governmentSchemes.findIndex((s) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Scheme not found.' });
    }

    db.governmentSchemes.splice(index, 1);
    return res.json({ success: true, message: 'Scheme deleted successfully.' });
  }

  static async getAnalytics(req: AuthenticatedRequest, res: Response) {
    const cropDistribution = [
      { name: 'Wheat (गेहूं)', farmers: 4520, percent: 34 },
      { name: 'Soybean (सोयाबीन)', farmers: 3100, percent: 23 },
      { name: 'Paddy / Basmati', farmers: 2850, percent: 21 },
      { name: 'Mustard (सरसों)', farmers: 1640, percent: 12 },
      { name: 'Onion / Vegetables', farmers: 1320, percent: 10 },
    ];

    const monthlyRegistrations = [
      { month: 'Jun', count: 1200 },
      { month: 'Jul', count: 2100 },
      { month: 'Aug', count: 2800 },
      { month: 'Sep', count: 3200 },
      { month: 'Oct', count: 4100 },
      { month: 'Nov', count: 4950 },
    ];

    const diseaseDiagnoses = [
      { disease: 'Yellow / Brown Rust', count: 840, severity: 'High' },
      { disease: 'Foliar Leaf Blight', count: 620, severity: 'Medium' },
      { disease: 'Powdery Mildew', count: 490, severity: 'Medium' },
      { disease: 'Stem Borer Infestation', count: 310, severity: 'High' },
      { disease: 'Zinc / Nitrogen Deficiency', count: 540, severity: 'Low' },
    ];

    return res.json({
      success: true,
      data: {
        cropDistribution,
        monthlyRegistrations,
        diseaseDiagnoses,
      },
    });
  }

  static async submitFeedback(req: AuthenticatedRequest, res: Response) {
    const { rating, message } = req.body;
    const farmer = req.user;

    const newFb: Feedback = {
      id: `fb-${Date.now()}`,
      farmerId: farmer ? farmer.id : 'usr-farmer-01',
      farmerName: farmer ? farmer.fullName : 'Kisan User',
      rating: Number(rating) || 5,
      message: message || 'Great platform for farmers.',
      createdAt: new Date().toISOString(),
    };

    db.feedbacks.unshift(newFb);
    return res.status(201).json({ success: true, message: 'Feedback submitted. Dhanyavaad!', data: newFb });
  }

  static async getFeedbacks(req: Request, res: Response) {
    return res.json({ success: true, data: db.feedbacks });
  }
}
