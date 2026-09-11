export type ProductStatus = 'draft' | 'published';

export interface Product {
  id: string;
  title: string;
  category: string;
  material: string | null;
  color: string | null;
  dimensions: string | null;
  weight: string | null;
  origin: string | null;
  technique: string | null;
  careInstructions: string | null;
  stock: number;
  descriptionEn: string;
  descriptionHi: string;
  keywords: string[];
  imageOriginalUrl: string;
  imageEnhancedUrl: string;
  imagePublicId: string;
  materialCost: number;
  labourCost: number;
  packagingCost: number;
  totalCost: number;
  marginPercentage: number;
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  pricingExplanation: string[];
  aiConfidence: number | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}
