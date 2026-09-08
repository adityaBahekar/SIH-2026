import { z } from 'zod';

export const catalogRequestSchema = z.object({
  imageUrl: z.string().url(),
  description: z.string().trim().max(1000).default(''),
});

export const catalogResponseSchema = z.object({
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(100),
  material: z.string().trim().max(100).nullable().default(null),
  color: z.string().trim().max(100).nullable().default(null),
  descriptionEn: z.string().trim().min(1).max(1000),
  descriptionHi: z.string().trim().min(1).max(1000),
  keywords: z.array(z.string().trim().min(1).max(60)).min(1).max(15).default([]),
  aiConfidence: z.number().min(0).max(1).nullable().default(null),
  demoMode: z.boolean().default(false),
});
