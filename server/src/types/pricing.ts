export interface PricingRequest {
  materialCost: number;
  labourCost: number;
  packagingCost: number;
  category: string;
  material?: string | undefined;
  marginPercentage?: number | undefined;
}

export interface PricingResponse {
  materialCost: number;
  labourCost: number;
  packagingCost: number;
  totalCost: number;
  marginPercentage: number;
  recommendedPrice: number;
  minPrice: number;
  maxPrice: number;
  explanation: string[];
}
