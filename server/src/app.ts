import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { healthRoutes } from './routes/healthRoutes.js';
import { pricingRoutes } from './routes/pricingRoutes.js';
import { productRoutes } from './routes/productRoutes.js';
import { aiRoutes } from './routes/aiRoutes.js';

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: env.CLIENT_ORIGIN === '*' ? true : (env.NODE_ENV === 'production' ? env.CLIENT_ORIGIN : true),
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000 }));

app.use('/api/health', healthRoutes);
app.use('/api/products/calculate-price', pricingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products', aiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);
