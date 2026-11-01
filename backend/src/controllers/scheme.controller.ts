import { Request, Response } from 'express';
import { db, SavedScheme } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class SchemeController {
  static async getAll(req: Request, res: Response) {
    const { category, search, state } = req.query;

    let schemes = [...db.governmentSchemes];

    if (category && category !== 'All') {
      schemes = schemes.filter((s) => s.category.toLowerCase() === String(category).toLowerCase());
    }

    if (state && state !== 'All India') {
      schemes = schemes.filter((s) => s.stateApplicable === 'All India' || s.stateApplicable.toLowerCase().includes(String(state).toLowerCase()));
    }

    if (search) {
      const q = String(search).toLowerCase();
      schemes = schemes.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      total: schemes.length,
      data: schemes,
    });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const scheme = db.governmentSchemes.find((s) => s.id === id);

    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Government scheme not found.' });
    }

    return res.json({ success: true, data: scheme });
  }

  static async checkEligibility(req: Request, res: Response) {
    const { landSize, state, crops, hasAadhaar, hasBankPassbook, category } = req.body;

    const parsedLand = Number(landSize) || 2.0;

    const evaluated = db.governmentSchemes.map((scheme) => {
      let isEligible = true;
      const reasons: string[] = [];

      if (scheme.minLandRequired && parsedLand < scheme.minLandRequired) {
        isEligible = false;
        reasons.push(`Minimum land required is ${scheme.minLandRequired} acres (Current: ${parsedLand} acres)`);
      }

      if (scheme.maxLandRequired && parsedLand > scheme.maxLandRequired) {
        isEligible = false;
        reasons.push(`Maximum land cap is ${scheme.maxLandRequired} acres for this specific subsidy tier`);
      }

      if (hasAadhaar === false && scheme.documents.some((d) => d.toLowerCase().includes('aadhaar'))) {
        isEligible = false;
        reasons.push('Aadhaar linkage is mandatory for DBT transfers');
      }

      if (isEligible) {
        reasons.push('Meets landholding criteria, documentary baseline, and state eligibility');
      }

      return {
        scheme,
        isEligible,
        matchPercentage: isEligible ? 95 : 40,
        reasons,
      };
    });

    return res.json({
      success: true,
      data: evaluated,
    });
  }

  static async saveScheme(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id || 'usr-farmer-01';
    const { schemeId } = req.body;

    if (!schemeId) {
      return res.status(400).json({ success: false, message: 'Scheme ID is required.' });
    }

    const scheme = db.governmentSchemes.find((s) => s.id === schemeId);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme does not exist.' });
    }

    const exists = db.savedSchemes.some((s) => s.farmerId === farmerId && s.schemeId === schemeId);
    if (exists) {
      return res.json({ success: true, message: 'Scheme already saved in your bookmarks.' });
    }

    const newSaved: SavedScheme = {
      id: `ss-${Date.now()}`,
      farmerId,
      schemeId,
      savedAt: new Date().toISOString(),
    };

    db.savedSchemes.push(newSaved);

    return res.status(201).json({
      success: true,
      message: 'Scheme bookmarked to your profile.',
      data: newSaved,
    });
  }

  static async unsaveScheme(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id || 'usr-farmer-01';
    const { schemeId } = req.params;

    const idx = db.savedSchemes.findIndex((s) => s.farmerId === farmerId && s.schemeId === schemeId);
    if (idx !== -1) {
      db.savedSchemes.splice(idx, 1);
    }

    return res.json({ success: true, message: 'Scheme removed from saved bookmarks.' });
  }

  static async getSaved(req: AuthenticatedRequest, res: Response) {
    const farmerId = req.user?.id || 'usr-farmer-01';
    const savedIds = db.savedSchemes.filter((s) => s.farmerId === farmerId).map((s) => s.schemeId);
    const saved = db.governmentSchemes.filter((s) => savedIds.includes(s.id));

    return res.json({ success: true, data: saved });
  }

  static async getAdvisory(req: Request, res: Response) {
    const { state, landSize } = req.query;
    const parsedLand = Number(landSize) || 3.5;

    const advisory = {
      upcomingDeadlines: [
        {
          id: 'dl-01',
          scheme: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
          deadline: 'Cutoff: 31st December (Rabi Crops)',
          type: 'CRITICAL',
          description: 'Enrollment cutoff for wheat, mustard, and gram insurance. Non-loanee farmers must submit sowing certificate before cutoff.',
          actionUrl: 'https://pmfby.gov.in',
        },
        {
          id: 'dl-02',
          scheme: 'PM-KISAN 18th DBT Installment Release',
          deadline: 'Mandatory e-KYC Before Next Cycle',
          type: 'WARNING',
          description: 'Mandatory Aadhaar biometric e-KYC via PM-KISAN Portal or face authentication mobile app to avoid installment freeze.',
          actionUrl: 'https://pmkisan.gov.in',
        },
        {
          id: 'dl-03',
          scheme: 'Kisan Credit Card (KCC) 3% Interest Subvention',
          deadline: 'Prompt Repayment Window: 31st March',
          type: 'NOTICE',
          description: 'Pay short-term crop loans promptly within 12 months to bring net effective interest rate down to just 4% per annum.',
          actionUrl: 'https://myscheme.gov.in/schemes/kcc',
        },
        {
          id: 'dl-04',
          scheme: 'PMKSY Drip & Sprinkler Subsidy Applications',
          deadline: 'Open Portal Window (First-Come, First-Served)',
          type: 'INFO',
          description: 'State horticulture portals have opened subsidies up to 55% for small/marginal farmers installing ISI-certified micro-irrigation.',
          actionUrl: 'https://pmksy.gov.in',
        },
      ],

      rejectionPreventionTips: [
        {
          title: 'Aadhaar NPCI Bank Seeding (डीबीटी आधार सीडिंग)',
          problem: 'Bank account is active, but funds bounce because Aadhaar is not linked to NPCI mapper.',
          solution: 'Visit your home bank branch and submit the "Consent Form for Aadhaar Seeding with NPCI Mapper", or check status via UIDAI portal.',
        },
        {
          title: 'Name Spelling Discrepancy (नाम की वर्तनी भिन्नता)',
          problem: 'Name in land title extract (7/12, Khasra, Khatauni) slightly differs from Aadhaar card spelling.',
          solution: 'Obtain a village Patwari / Gram Sevak certificate of identity or update Aadhaar to match revenue records.',
        },
        {
          title: 'Joint Landholding Exclusion (संयुक्त खातेदार एनओसी)',
          problem: 'Land is jointly owned among family members without individual mutation.',
          solution: 'Submit self-declaration affidavit with consent of co-sharers or partition deed to claim individual family benefit.',
        },
        {
          title: 'Ineligible Category Exclusions (अपात्रता नियम)',
          problem: 'Serving government employees, institutional landholders, or income tax payees are excluded from PM-KISAN.',
          solution: 'Review Section 2 exclusions before applying to avoid audit notices and recovery proceedings.',
        },
      ],

      estimatedFinancialBenefits: {
        landSize: parsedLand,
        pmKisanAnnual: 6000,
        dripIrrigationSubsidy: parsedLand <= 5 ? Math.round(parsedLand * 18000) : 45000,
        kccInterestSavings: Math.round(parsedLand * 45000 * 0.03), // 3% subvention on loan amount
        totalEstimatedBenefit: 6000 + (parsedLand <= 5 ? Math.round(parsedLand * 18000) : 45000) + Math.round(parsedLand * 45000 * 0.03),
      },

      stepByStepApplyGuide: [
        {
          step: 1,
          title: 'Check Documents First',
          desc: 'Keep Aadhaar Card (linked with active mobile OTP), latest 7/12 or Khasra-Khatauni revenue record, and Bank Passbook (NPCI seeded) ready.',
        },
        {
          step: 2,
          title: 'Self-Registration or CSC Center',
          desc: 'Apply directly through national portals (pmkisan.gov.in / pmfby.gov.in) using Aadhaar OTP, or visit your nearest Gram Panchayat Common Service Center (CSC).',
        },
        {
          step: 3,
          title: 'Local Revenue Verification',
          desc: 'Your application is forwarded to the District Agriculture Officer / Revenue Patwari for field and landholding verification.',
        },
        {
          step: 4,
          title: 'Direct Benefit Transfer (DBT)',
          desc: 'Funds and subsidies are credited directly into your Aadhaar-linked bank account without any intermediaries.',
        },
      ],
    };

    return res.json({
      success: true,
      data: advisory,
      timestamp: new Date().toISOString(),
    });
  }
}
