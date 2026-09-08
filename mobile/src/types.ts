export type WorkflowStep = 'photo' | 'catalog' | 'price' | 'publish';

export interface DraftProduct {
  description: string;
  imageUri: string | null;
}
