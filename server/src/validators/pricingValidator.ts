import { z } from 'zod';

export const pricingRequestSchema = z.object({
  materialCost: z.number().finite().nonnegative().max(1_000_000),
  labourCost: z.number().finite().nonnegative().max(1_000_000),
  packagingCost: z.number().finite().nonnegative().max(1_000_000),
  category: z.string().trim().min(1).max(100),
  material: z.string().trim().max(100).optional(),
  marginPercentage: z.number().finite().min(10).max(80).optional(),
});
