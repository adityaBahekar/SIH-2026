import { Router } from 'express';
import { calculatePriceHandler } from '../controllers/pricingController.js';

export const pricingRoutes = Router();

pricingRoutes.post('/', calculatePriceHandler);
