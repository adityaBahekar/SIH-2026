export interface CatalogResponse {
  title: string;
  category: string;
  material: string | null;
  color: string | null;
  descriptionEn: string;
  descriptionHi: string;
  keywords: string[];
  aiConfidence: number | null;
  demoMode: boolean;
}
