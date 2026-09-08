import { z } from 'zod';

const productFields = {
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(100),
  material: z.string().trim().max(100).nullable(),
  color: z.string().trim().max(100).nullable(),
  descriptionEn: z.string().trim().min(1).max(1000),
  descriptionHi: z.string().trim().min(1).max(1000),
  keywords: z.array(z.string().trim().min(1).max(60)).max(10),
  imageOriginalUrl: z.string().url(),
  imageEnhancedUrl: z.string().url(),
  imagePublicId: z.string().trim().min(1).max(300),
  materialCost: z.number().finite().nonnegative().max(1_000_000).default(0),
  labourCost: z.number().finite().nonnegative().max(1_000_000).default(0),
  packagingCost: z.number().finite().nonnegative().max(1_000_000).default(0),
  totalCost: z.number().finite().nonnegative().max(3_000_000),
  marginPercentage: z.number().finite().min(10).max(80),
  recommendedPrice: z.number().finite().nonnegative().max(10_000_000),
  minPrice: z.number().finite().nonnegative().max(10_000_000),
  maxPrice: z.number().finite().nonnegative().max(10_000_000),
  pricingExplanation: z.array(z.string().trim().min(1).max(200)).max(10).default([]),
  aiConfidence: z.number().finite().min(0).max(1).nullable(),
  status: z.enum(['draft', 'published']),
};

export const createProductSchema = z.object(productFields);
export const updateProductSchema = createProductSchema.partial();
