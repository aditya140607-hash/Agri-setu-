import { Request, Response } from 'express';

export class InsuranceController {
  static async getSchemes(req: Request, res: Response) {
    const insurancePlans = [
      {
        id: 'ins-pmfby',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        type: 'Yield-Based Multi-Peril Crop Insurance',
        farmerPremiumRate: 'Kharif: 2.0% | Rabi: 1.5% | Annual Commercial: 5.0%',
        coverage: 'Prevented Sowing, Standing Crop Losses (Drought, Dry Spells, Flood, Inundation, Pests & Diseases), Post-Harvest Losses (up to 14 days after harvesting for crops kept in cut & spread condition in the field against unseasonal cyclone/hailstorm), Localized Calamities (Hailstorm, Landslide, Inundation, Cloud burst, Natural Fire).',
        tollFreeHelpline: '14447 (National PMFBY Crop Insurance Toll-Free)',
        intimationDeadline: 'Within 72 Hours of localized damage through Crop Insurance App or Bank/Agriculture Office',
        portalUrl: 'https://pmfby.gov.in',
      },
      {
        id: 'ins-rwbcis',
        title: 'Restructured Weather Based Crop Insurance Scheme (RWBCIS)',
        type: 'Weather-Index Parametric Insurance',
        farmerPremiumRate: 'Capped at 1.5% - 2% (Balance subsidized by Govt)',
        coverage: 'Adverse weather triggers such as deficit rainfall, excess rainfall, prolonged dry spells, frost, unseasonal heat wave, high wind speed, and extreme relative humidity recorded at Reference Weather Stations (RWS).',
        tollFreeHelpline: '1800-180-1551 (Kisan Call Centre)',
        intimationDeadline: 'Automatic settlement based on automated AWS weather station data logs without needing manual loss survey',
        portalUrl: 'https://pmfby.gov.in/rwbcis',
      },
      {
        id: 'ins-livestock',
        title: 'National Livestock Mission - Cattle Insurance',
        type: 'Livestock & Asset Protection',
        farmerPremiumRate: 'Up to 50% - 70% central & state government subsidy on premium for small/marginal farmers',
        coverage: 'Death of indigenous or cross-breed milch cattle, buffaloes, sheep, goat due to accidental electrocution, disease epidemics (e.g. Lumpy skin, FMD), natural calamities, snakebite.',
        tollFreeHelpline: '1800-180-5518',
        intimationDeadline: 'Immediate post-mortem report by Government Veterinary Assistant Surgeon',
        portalUrl: 'https://dahd.nic.in',
      },
    ];

    return res.json({ success: true, data: insurancePlans });
  }

  static async getGuidance(req: Request, res: Response) {
    const guidance = {
      stepsToClaim: [
        {
          step: 1,
          title: 'Immediate Intimation (Within 72 Hours)',
          desc: 'Inform your bank branch, insurance company agent, or submit details via PMFBY Crop Insurance mobile app within 72 hours of unseasonal rain, hailstorm, or flood.',
        },
        {
          step: 2,
          title: 'Document Loss Evidence',
          desc: 'Take geotagged photographs and videos of the submerged or lodged crops showing field landmarks.',
        },
        {
          step: 3,
          title: 'Joint Field Survey (JFS)',
          desc: 'Agriculture department official, insurance company surveyor, and Gram Panchayat representative will visit for loss assessment.',
        },
        {
          step: 4,
          title: 'Direct Bank Settlement (DBT)',
          desc: 'Claim compensation is credited directly into your Aadhaar-linked bank account within 30-45 days.',
        },
      ],
      helpline: '14447',
      kisanCallCentre: '1800-180-1551',
    };

    return res.json({ success: true, data: guidance });
  }
}
