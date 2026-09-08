import type { RequestHandler } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { calculatePrice } from '../services/pricingService.js';
import { pricingRequestSchema } from '../validators/pricingValidator.js';

export const calculatePriceHandler: RequestHandler = (request, response, next) => {
  const parsed = pricingRequestSchema.safeParse(request.body);

  if (!parsed.success) {
    next(new AppError(400, 'VALIDATION_ERROR', 'Invalid pricing information.', parsed.error.issues));
    return;
  }

  response.json({ success: true, data: calculatePrice(parsed.data) });
};
