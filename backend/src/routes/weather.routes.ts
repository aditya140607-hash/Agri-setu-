import { Router } from 'express';
import { WeatherController } from '../controllers/weather.controller.js';

const router = Router();

router.get('/current', WeatherController.getCurrent);
router.get('/forecast', WeatherController.getForecast);
router.get('/alerts', WeatherController.getAlerts);

export default router;
