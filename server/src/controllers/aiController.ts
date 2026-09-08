import type { RequestHandler } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { generateCatalog } from '../services/catalogService.js';
import { uploadAndEnhanceImage } from '../services/cloudinaryService.js';
import { catalogRequestSchema } from '../validators/catalogValidator.js';

export const enhanceImageHandler: RequestHandler = async (request, response, next) => {
  try {
    let buffer: Buffer | null = null;
    let mimeType = 'image/jpeg';

    if (request.file) {
      buffer = request.file.buffer;
      mimeType = request.file.mimetype || 'image/jpeg';
    } else if (request.body?.image && typeof request.body.image === 'string') {
      const imgStr = request.body.image as string;
      if (imgStr.startsWith('data:')) {
        const matches = imgStr.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches[1] && matches[2]) {
          mimeType = matches[1];
          buffer = Buffer.from(matches[2], 'base64');
        }
      } else {
        buffer = Buffer.from(imgStr, 'base64');
      }
    }

    if (!buffer) {
      next(new AppError(400, 'IMAGE_REQUIRED', 'Please select a product image.'));
      return;
    }

    const result = await uploadAndEnhanceImage(buffer, mimeType);
    response.json({ success: true, data: result });
  } catch (error) {
    console.error('[AI Controller] enhanceImageHandler error:', error);
    next(new AppError(502, 'IMAGE_PROCESSING_FAILED', 'We could not improve this photo right now.'));
  }
};

export const generateCatalogHandler: RequestHandler = async (request, response, next) => {
  try {
    const parsed = catalogRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      next(new AppError(400, 'VALIDATION_ERROR', 'Invalid catalog information.', parsed.error.issues));
      return;
    }
    const result = await generateCatalog(parsed.data.imageUrl, parsed.data.description);
    response.json({ success: true, data: result });
  } catch (error) {
    next(new AppError(502, 'CATALOG_GENERATION_FAILED', 'We could not create the catalog right now. You can try again or enter the details manually.'));
  }
};
