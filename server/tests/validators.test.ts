import { describe, expect, it } from 'vitest';
import { catalogRequestSchema, catalogResponseSchema } from '../src/validators/catalogValidator.js';
import { createProductSchema } from '../src/validators/productValidator.js';

describe('catalogRequestSchema', () => {
  it('accepts standard HTTP/HTTPS URLs', () => {
    const result = catalogRequestSchema.safeParse({
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      description: 'Handmade pottery',
    });
    expect(result.success).toBe(true);
  });

  it('accepts Base64 data URIs from demo/offline mode', () => {
    const result = catalogRequestSchema.safeParse({
      imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
      description: 'Handmade terracotta pot',
    });
    expect(result.success).toBe(true);
  });
});

describe('catalogResponseSchema', () => {
  it('accepts valid response with expanded fields', () => {
    const result = catalogResponseSchema.safeParse({
      title: 'Handcrafted Terracotta Vase',
      category: 'Pottery & Ceramics',
      material: 'Terracotta Clay',
      color: 'Earth Red',
      dimensions: '12 x 8 x 8 inches',
      weight: '600 grams',
      origin: 'Khurja, Uttar Pradesh',
      technique: 'Wheel Thrown & Kiln Fired',
      careInstructions: 'Wipe with dry cloth',
      stock: 10,
      descriptionEn: 'Authentic handcrafted vase made by traditional potters.',
      descriptionHi: 'पारंपरिक कुम्हारों द्वारा निर्मित प्रामाणिक हस्तनिर्मित फूलदान।',
      keywords: ['pottery', 'terracotta', 'vase'],
      aiConfidence: 0.95,
      demoMode: false,
    });
    expect(result.success).toBe(true);
  });
});

describe('createProductSchema', () => {
  it('accepts product with Base64 demo images and expanded fields', () => {
    const result = createProductSchema.safeParse({
      title: 'Jaipur Blue Pottery Plate',
      category: 'Pottery & Ceramics',
      material: 'Quartz & Clay',
      color: 'Cobalt Blue',
      dimensions: '10 inch diameter',
      weight: '400 grams',
      origin: 'Jaipur, Rajasthan',
      technique: 'Glazed Blue Pottery',
      careInstructions: 'Gentle hand wash',
      stock: 8,
      descriptionEn: 'Famous Jaipur blue pottery hand-painted decorative plate.',
      descriptionHi: 'प्रसिद्ध जयपुर ब्लू पॉटरी हाथ से चित्रित सजावटी प्लेट।',
      keywords: ['blue pottery', 'jaipur craft', 'hand painted'],
      imageOriginalUrl: 'data:image/jpeg;base64,abc123',
      imageEnhancedUrl: 'data:image/jpeg;base64,abc123',
      imagePublicId: 'demo-12345',
      materialCost: 200,
      labourCost: 150,
      packagingCost: 40,
      totalCost: 390,
      marginPercentage: 30,
      recommendedPrice: 750,
      minPrice: 675,
      maxPrice: 860,
      pricingExplanation: ['Base cost: ₹390', 'Margin: 30%'],
      aiConfidence: 0.9,
      status: 'draft',
    });
    expect(result.success).toBe(true);
  });
});
