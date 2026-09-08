import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import type { CatalogResponse } from '../types/catalog.js';
import { catalogResponseSchema } from '../validators/catalogValidator.js';
import { buildCatalogPrompt } from './catalogPromptBuilder.js';

const demoCatalog = (description: string): CatalogResponse => {
  const cleanDescription = description.trim();
  const lowerDescription = cleanDescription.toLowerCase();
  const material = lowerDescription.includes('cotton') ? 'Cotton' : null;
  const color = lowerDescription.includes('red') ? 'Red' : null;
  const title = cleanDescription.length > 3 && cleanDescription.length <= 70
    ? cleanDescription.charAt(0).toUpperCase() + cleanDescription.slice(1)
    : 'Handmade Artisan Product';

  return {
    title,
    category: 'Handicrafts',
    material,
    color,
    descriptionEn: cleanDescription || 'Handmade artisan product. Add more details before publishing.',
    descriptionHi: 'हस्तनिर्मित कारीगर उत्पाद। प्रकाशित करने से पहले आप इसमें अधिक जानकारी जोड़ सकते हैं।',
    keywords: ['handmade', 'artisan product', 'traditional craft', 'made with care', 'handicraft'],
    aiConfidence: null,
    demoMode: true,
  };
};

const loadImage = async (imageUrl: string): Promise<{ mimeType: string; imageData: string }> => {
  if (imageUrl.startsWith('data:')) {
    const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches?.[1] || !matches[2]) throw new Error('Invalid image data.');
    return { mimeType: matches[1], imageData: matches[2] };
  }

  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error('Unable to read the enhanced product image.');
  return {
    mimeType: response.headers.get('content-type') ?? 'image/jpeg',
    imageData: Buffer.from(await response.arrayBuffer()).toString('base64'),
  };
};

const requestCatalog = async (imageUrl: string, description: string): Promise<CatalogResponse> => {
  if (!env.GEMINI_API_KEY) return demoCatalog(description);

  const { mimeType, imageData } = await loadImage(imageUrl);
  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  const result = await ai.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: [{
      role: 'user',
      parts: [
        { text: buildCatalogPrompt(description || 'Handmade artisan product.') },
        { inlineData: { mimeType, data: imageData } },
      ],
    }],
    config: { responseMimeType: 'application/json' },
  });

  const rawJson: unknown = JSON.parse(result.text ?? '{}');
  const parsed = catalogResponseSchema.safeParse({
    ...(typeof rawJson === 'object' && rawJson !== null ? rawJson : {}),
    demoMode: false,
  });
  if (!parsed.success) throw new Error('Gemini returned an invalid catalog response.');
  return { ...parsed.data, demoMode: false };
};

export const generateCatalog = async (imageUrl: string, description: string): Promise<CatalogResponse> => {
  try {
    return await requestCatalog(imageUrl, description);
  } catch (error) {
    console.warn('[Catalog] Provider failed; using explicit demo mode.', error instanceof Error ? error.message : error);
    return demoCatalog(description);
  }
};
