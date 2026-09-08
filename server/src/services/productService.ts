import { ProductModel, type ProductDocument } from '../models/Product.js';
import type { Product } from '../types/product.js';

type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
type ProductUpdate = { [Key in keyof ProductInput]?: ProductInput[Key] | undefined };

const toProduct = (document: ProductDocument): Product => ({
  id: document._id.toString(),
  title: document.title,
  category: document.category,
  material: document.material,
  color: document.color,
  descriptionEn: document.descriptionEn,
  descriptionHi: document.descriptionHi,
  keywords: document.keywords,
  imageOriginalUrl: document.imageOriginalUrl,
  imageEnhancedUrl: document.imageEnhancedUrl,
  imagePublicId: document.imagePublicId,
  materialCost: document.materialCost,
  labourCost: document.labourCost,
  packagingCost: document.packagingCost,
  totalCost: document.totalCost,
  marginPercentage: document.marginPercentage,
  recommendedPrice: document.recommendedPrice,
  minPrice: document.minPrice,
  maxPrice: document.maxPrice,
  pricingExplanation: document.pricingExplanation,
  aiConfidence: document.aiConfidence,
  status: document.status,
  createdAt: document.createdAt.toISOString(),
  updatedAt: document.updatedAt.toISOString(),
});

export const createProduct = async (input: ProductInput): Promise<Product> => {
  const document = await ProductModel.create(input);
  return toProduct(document);
};

export const listProducts = async (): Promise<Product[]> => {
  const documents = await ProductModel.find().sort({ createdAt: -1 });
  return documents.map(toProduct);
};

export const getProduct = async (id: string): Promise<Product | null> => {
  const document = await ProductModel.findById(id);
  return document ? toProduct(document) : null;
};

export const updateProduct = async (id: string, input: ProductUpdate): Promise<Product | null> => {
  const document = await ProductModel.findByIdAndUpdate(id, input, { new: true, runValidators: true });
  return document ? toProduct(document) : null;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const result = await ProductModel.findByIdAndDelete(id);
  return result !== null;
};
