import { z } from 'zod';

const imageUrlSchema = z.string().min(1).refine(
  (val) => val.startsWith('data:') || /^https?:\/\//i.test(val),
  { message: 'Must be a valid HTTP(S) URL or data URI' }
);

const productFields = {
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(100),
  material: z.string().trim().max(100).nullable().default(null),
  color: z.string().trim().max(100).nullable().default(null),
  dimensions: z.string().trim().max(100).nullable().default(null),
  weight: z.string().trim().max(100).nullable().default(null),
  origin: z.string().trim().max(150).nullable().default(null),
  technique: z.string().trim().max(150).nullable().default(null),
  careInstructions: z.string().trim().max(500).nullable().default(null),
  stock: z.coerce.number().int().nonnegative().default(5),
  descriptionEn: z.string().trim().min(1).max(1000),
  descriptionHi: z.string().trim().min(1).max(1000),
  keywords: z.array(z.string().trim().min(1).max(60)).max(15).default([]),
  imageOriginalUrl: imageUrlSchema,
  imageEnhancedUrl: imageUrlSchema,
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
  aiConfidence: z.number().finite().min(0).max(1).nullable().default(null),
  status: z.enum(['draft', 'published']),
};

export const createProductSchema = z.object(productFields);
export const updateProductSchema = createProductSchema.partial();
