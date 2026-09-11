import { z } from 'zod';

const imageUrlSchema = z.string().min(1).refine(
  (val) => val.startsWith('data:') || /^https?:\/\//i.test(val),
  { message: 'Must be a valid HTTP(S) URL or data URI' }
);

export const catalogRequestSchema = z.object({
  imageUrl: imageUrlSchema,
  description: z.string().trim().max(1000).default(''),
});

export const catalogResponseSchema = z.object({
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
  keywords: z.array(z.string().trim().min(1).max(60)).min(1).max(15).default([]),
  aiConfidence: z.number().min(0).max(1).nullable().default(null),
  demoMode: z.boolean().default(false),
});
