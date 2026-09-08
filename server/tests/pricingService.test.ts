import { describe, expect, it } from 'vitest';
import { calculatePrice } from '../src/services/pricingService.js';

describe('calculatePrice', () => {
  it('applies the handicrafts market multiplier (1.25x) correctly', () => {
    const result = calculatePrice({
      materialCost: 250,
      labourCost: 150,
      packagingCost: 30,
      category: 'Handicrafts',
    });

    // totalCost = 250 + 150 + 30 = 430
    // base = 430 / (1 - 0.30) = 614.28
    // recommended = round(614.28 * 1.25) = 768
    // min = round(768 * 0.90) = 691
    // max = round(768 * 1.15) = 883
    expect(result.totalCost).toBe(430);
    expect(result.marginPercentage).toBe(30);
    expect(result.recommendedPrice).toBe(768);
    expect(result.minPrice).toBe(691);
    expect(result.maxPrice).toBe(883);
    expect(result.explanation.length).toBeGreaterThanOrEqual(3);
  });

  it('applies jewellery premium multiplier (1.65x)', () => {
    const result = calculatePrice({
      materialCost: 850,
      labourCost: 650,
      packagingCost: 100,
      category: 'Jewellery',
      marginPercentage: 35,
    });

    const totalCost = 850 + 650 + 100; // 1600
    const basePrice = totalCost / (1 - 0.35); // ~2461.5
    const expected = Math.round(basePrice * 1.65); // ~4062

    expect(result.totalCost).toBe(1600);
    expect(result.recommendedPrice).toBe(expected);
    expect(result.recommendedPrice).toBeGreaterThan(3000);
  });

  it('applies textiles & apparel multiplier (1.40x)', () => {
    const result = calculatePrice({
      materialCost: 600,
      labourCost: 450,
      packagingCost: 60,
      category: 'Textiles & Apparel',
      marginPercentage: 30,
    });

    const totalCost = 600 + 450 + 60; // 1110
    const basePrice = totalCost / 0.7; // ~1585.7
    const expected = Math.round(basePrice * 1.4); // ~2220

    expect(result.totalCost).toBe(1110);
    expect(result.recommendedPrice).toBe(expected);
  });

  it('returns different prices for different categories with same costs', () => {
    const base = { materialCost: 300, labourCost: 200, packagingCost: 50 };
    const pottery = calculatePrice({ ...base, category: 'Pottery' });
    const jewellery = calculatePrice({ ...base, category: 'Jewellery' });
    const woodwork = calculatePrice({ ...base, category: 'Woodwork' });

    // All three should be distinctly different
    expect(jewellery.recommendedPrice).toBeGreaterThan(pottery.recommendedPrice);
    expect(woodwork.recommendedPrice).toBeGreaterThan(pottery.recommendedPrice);
    expect(jewellery.recommendedPrice).toBeGreaterThan(woodwork.recommendedPrice);
  });

  it('min price is always lower than max price', () => {
    const result = calculatePrice({
      materialCost: 400,
      labourCost: 300,
      packagingCost: 50,
      category: 'Bags & Accessories',
    });
    expect(result.minPrice).toBeLessThan(result.recommendedPrice);
    expect(result.maxPrice).toBeGreaterThan(result.recommendedPrice);
  });
});
