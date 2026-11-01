import { Request, Response } from 'express';
import { db } from '../config/database.js';

export class WeatherController {
  static async getCurrent(req: Request, res: Response) {
    const district = (req.query.district as string) || 'Nashik';

    let record = db.weatherRecords.find((w) => w.district.toLowerCase() === district.toLowerCase());
    if (!record) {
      record = db.weatherRecords[0];
    }

    return res.json({
      success: true,
      data: record,
      source: 'IMD Agri-Meteorological Division & Agro-Advisory Network',
      lastUpdated: new Date().toISOString(),
    });
  }

  static async getForecast(req: Request, res: Response) {
    const district = (req.query.district as string) || 'Nashik';
    let record = db.weatherRecords.find((w) => w.district.toLowerCase() === district.toLowerCase());
    if (!record) {
      record = db.weatherRecords[0];
    }

    return res.json({
      success: true,
      district: record.district,
      state: record.state,
      forecast: record.forecast,
      lastUpdated: new Date().toISOString(),
    });
  }

  static async getAlerts(req: Request, res: Response) {
    const alerts = [
      {
        id: 'alt-01',
        title: 'Morning Dense Fog & High Relative Humidity',
        level: 'WARNING',
        area: 'Northern & Central Plains (Punjab, Haryana, Western UP, Malwa)',
        advisory: 'Relative humidity will exceed 80% during morning hours. Postpone foliar insecticide sprays until sun emerges. Monitor wheat for rust spore germination.',
        validTill: 'Next 48 Hours',
      },
      {
        id: 'alt-02',
        title: 'Unseasonal Gusty Winds Alert (25-35 km/h)',
        level: 'WATCH',
        area: 'Nashik, Pune, Jalgaon belts',
        advisory: 'Provide staking support for tall banana and horticultural trees. Delay urea broadcasting before strong wind periods.',
        validTill: 'Next 24 Hours',
      },
    ];

    return res.json({ success: true, data: alerts });
  }
}
