import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface ApiErrorBody {
  success: false;
  error: { code: string; message: string; details?: unknown[] };
}

interface ApiSuccessBody<T> {
  success: true;
  data: T;
}

export interface CatalogResponse {
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
  aiConfidence: number | null;
  demoMode: boolean;
}

export interface PricingResponse {
  materialCost?: number;
  labourCost?: number;
  packagingCost?: number;
  totalCost: number;
  marginPercentage: number;
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  explanation: string[];
}

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
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export type ProductSummary = Product;

const request = async <T extends object>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  });
  const body = (await response.json()) as T | ApiSuccessBody<T> | ApiErrorBody;
  if (!response.ok || ('success' in body && body.success === false)) {
    const error = body as ApiErrorBody;
    throw new Error(error.error?.message ?? 'Something went wrong.');
  }
  return ('success' in body ? body.data : body) as T;
};

export const generateCatalog = (imageUrl: string, description: string): Promise<CatalogResponse> => request('/products/generate-catalog', {
  method: 'POST',
  body: JSON.stringify({ imageUrl, description }),
});

export interface EnhancedImageResponse {
  originalUrl: string;
  enhancedUrl: string;
  publicId: string;
  demoMode: boolean;
}

export const uploadImage = async (uri: string): Promise<EnhancedImageResponse> => {
  if (Platform.OS !== 'web' && FileSystem && typeof FileSystem.uploadAsync === 'function') {
    const response = await FileSystem.uploadAsync(`${API_URL}/products/image`, uri, {
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'image',
      mimeType: 'image/jpeg',
      httpMethod: 'POST',
    });
    let body: { success: true; data: EnhancedImageResponse } | ApiErrorBody;
    try {
      body = JSON.parse(response.body);
    } catch {
      throw new Error(`Server returned unexpected response (${response.status})`);
    }
    if (response.status < 200 || response.status >= 300 || body.success === false) {
      throw new Error(body.success === false ? body.error.message : 'Photo upload failed.');
    }
    return body.data;
  }

  if (Platform.OS !== 'web') throw new Error('Native image upload is unavailable. Please restart the app and try again.');

  const formData = new FormData();
  if (Platform.OS === 'web') {
    if (uri.startsWith('blob:') || uri.startsWith('data:')) {
      const blobRes = await fetch(uri);
      const blob = await blobRes.blob();
      formData.append('image', blob, 'product.jpg');
    } else {
      throw new Error('Web image upload requires a browser image URL.');
    }
  }

  const response = await fetch(`${API_URL}/products/image`, {
    method: 'POST',
    body: formData,
  });

  const body = (await response.json()) as { success: true; data: EnhancedImageResponse } | ApiErrorBody;
  if (!response.ok || body.success === false) {
    throw new Error(body.success === false ? body.error.message : 'Photo upload failed.');
  }
  return body.data;
};

export const calculatePrice = (input: { materialCost: number; labourCost: number; packagingCost: number; category: string; marginPercentage?: number }): Promise<PricingResponse> => request('/products/calculate-price', {
  method: 'POST',
  body: JSON.stringify(input),
});

export const saveProduct = (input: Record<string, unknown>): Promise<{ id: string }> => request('/products', {
  method: 'POST',
  body: JSON.stringify(input),
});

export const listProducts = (): Promise<Product[]> => request('/products', {
  method: 'GET',
});

export const getProduct = (id: string): Promise<Product> => request(`/products/${id}`, {
  method: 'GET',
});

export const updateProduct = (id: string, input: Partial<Product>): Promise<Product> => request(`/products/${id}`, {
  method: 'PUT',
  body: JSON.stringify(input),
});

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok && response.status !== 204) {
    throw new Error('Could not delete product.');
  }
};
