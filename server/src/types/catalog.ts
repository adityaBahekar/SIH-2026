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

