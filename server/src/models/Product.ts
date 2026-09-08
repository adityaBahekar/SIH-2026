import { Schema, model, type Document } from 'mongoose';
import type { ProductStatus } from '../types/product.js';

export interface ProductDocument extends Document {
  title: string;
  category: string;
  material: string | null;
  color: string | null;
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
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  category: { type: String, required: true, trim: true, maxlength: 100 },
  material: { type: String, default: null, trim: true, maxlength: 100 },
  color: { type: String, default: null, trim: true, maxlength: 100 },
  descriptionEn: { type: String, required: true, trim: true, maxlength: 1000 },
  descriptionHi: { type: String, required: true, trim: true, maxlength: 1000 },
  keywords: { type: [String], required: true, default: [] },
  imageOriginalUrl: { type: String, required: true },
  imageEnhancedUrl: { type: String, required: true },
  imagePublicId: { type: String, required: true },
  materialCost: { type: Number, required: true, min: 0 },
  labourCost: { type: Number, required: true, min: 0 },
  packagingCost: { type: Number, required: true, min: 0 },
  totalCost: { type: Number, required: true, min: 0 },
  marginPercentage: { type: Number, required: true, min: 10, max: 80 },
  recommendedPrice: { type: Number, required: true, min: 0 },
  minPrice: { type: Number, required: true, min: 0 },
  maxPrice: { type: Number, required: true, min: 0 },
  pricingExplanation: { type: [String], required: true, default: [] },
  aiConfidence: { type: Number, default: null, min: 0, max: 1 },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });

export const ProductModel = model<ProductDocument>('Product', productSchema);
