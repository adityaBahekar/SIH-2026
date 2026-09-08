import type { PricingRequest, PricingResponse } from '../types/pricing.js';

const DEFAULT_MARGIN_PERCENTAGE = 30;

// Category market demand & artisan skill multipliers for authentic Indian crafts
const CATEGORY_ADJUSTMENTS: Record<string, { multiplier: number; detail: string }> = {
  jewellery: { multiplier: 1.65, detail: 'High artisan skill & premium market markup for hand-crafted jewellery' },
  'bags & accessories': { multiplier: 1.25, detail: 'Standard retail markup for artisan accessories' },
  'textiles & apparel': { multiplier: 1.40, detail: 'Handloom & weave premium pricing for artisan textiles' },
  textiles: { multiplier: 1.35, detail: 'Handloom artisan textile market factor' },
  'home & decor': { multiplier: 1.30, detail: 'Home decor & artistic showpiece market valuation' },
  'home decor': { multiplier: 1.30, detail: 'Home decor artisan market valuation' },
  pottery: { multiplier: 1.20, detail: 'Ceramic & clay handcraft fair market valuation' },
  terracotta: { multiplier: 1.20, detail: 'Terracotta artisan craft market valuation' },
  woodwork: { multiplier: 1.45, detail: 'Intricate wood carving & craftsmanship valuation' },
  leather: { multiplier: 1.35, detail: 'Handmade leather craft premium valuation' },
  metalwork: { multiplier: 1.50, detail: 'Metal & brass craft artisan valuation' },
  handicrafts: { multiplier: 1.25, detail: 'Standard traditional handicraft market adjustment' },
};

const roundPrice = (value: number): number => Math.round(value);

export const calculatePrice = (request: PricingRequest): PricingResponse => {
  const totalCost = request.materialCost + request.labourCost + request.packagingCost;
  const marginPercentage = request.marginPercentage ?? DEFAULT_MARGIN_PERCENTAGE;
  const margin = marginPercentage / 100;
  
  const categoryKey = request.category.trim().toLowerCase();
  
  // Find matching category adjustment by substring match or exact key
  let adjustmentObj = CATEGORY_ADJUSTMENTS[categoryKey];
  if (!adjustmentObj) {
    for (const [key, val] of Object.entries(CATEGORY_ADJUSTMENTS)) {
      if (categoryKey.includes(key) || key.includes(categoryKey)) {
        adjustmentObj = val;
        break;
      }
    }
  }
  
  const marketAdjustment = adjustmentObj?.multiplier ?? 1.25;
  const adjustmentDetail = adjustmentObj?.detail ?? `Fair market adjustment (${marketAdjustment.toFixed(2)}x) for ${request.category.trim()}`;

  const basePrice = totalCost / Math.max(0.01, 1 - margin);
  const recommendedPrice = roundPrice(basePrice * marketAdjustment);

  return {
    materialCost: roundPrice(request.materialCost),
    labourCost: roundPrice(request.labourCost),
    packagingCost: roundPrice(request.packagingCost),
    totalCost: roundPrice(totalCost),
    marginPercentage,
    recommendedPrice,
    minPrice: roundPrice(recommendedPrice * 0.90),
    maxPrice: roundPrice(recommendedPrice * 1.15),
    explanation: [
      `Base total cost: ₹${roundPrice(totalCost)} (Material: ₹${roundPrice(request.materialCost)}, Labour: ₹${roundPrice(request.labourCost)}, Packaging: ₹${roundPrice(request.packagingCost)})`,
      `Target margin: ${marginPercentage}%`,
      `Market & Skill Factor: ${marketAdjustment.toFixed(2)}x - ${adjustmentDetail}`,
      `Suggested retail price range: ₹${roundPrice(recommendedPrice * 0.90)} to ₹${roundPrice(recommendedPrice * 1.15)}`,
    ],
  };
};
