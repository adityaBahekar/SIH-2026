import { Router } from 'express';
import multer from 'multer';
import { enhanceImageHandler, generateCatalogHandler } from '../controllers/aiController.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    const isImage = file.mimetype.startsWith('image/') ||
      Boolean(file.originalname.match(/\.(jpg|jpeg|png|webp|gif|bmp|heic|svg)$/i));
    callback(null, isImage);
  },
});

export const aiRoutes = Router();
aiRoutes.post('/image', upload.single('image'), enhanceImageHandler);
aiRoutes.post('/generate-catalog', generateCatalogHandler);
