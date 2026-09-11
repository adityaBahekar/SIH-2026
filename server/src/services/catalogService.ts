import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import type { CatalogResponse } from '../types/catalog.js';
import { catalogResponseSchema } from '../validators/catalogValidator.js';
import { buildCatalogPrompt } from './catalogPromptBuilder.js';

const demoCatalog = (description: string): CatalogResponse => {
  const cleanDescription = description.trim();
  const lowerDescription = cleanDescription.toLowerCase();
  const material = lowerDescription.includes('cotton') ? 'Cotton'
    : lowerDescription.includes('silk') ? 'Pure Silk'
    : lowerDescription.includes('clay') || lowerDescription.includes('terracotta') ? 'Terracotta Clay'
    : lowerDescription.includes('wood') ? 'Sheesham Wood'
    : lowerDescription.includes('brass') || lowerDescription.includes('metal') ? 'Brass'
    : 'Natural Handcrafted Material';
  const color = lowerDescription.includes('red') ? 'Crimson Red'
    : lowerDescription.includes('blue') ? 'Indigo Blue'
    : lowerDescription.includes('green') ? 'Emerald Green'
    : lowerDescription.includes('yellow') ? 'Ochre Yellow'
    : 'Earth Tone / Natural';
  const category = lowerDescription.includes('jewel') ? 'Jewellery'
    : lowerDescription.includes('saree') || lowerDescription.includes('textil') || lowerDescription.includes('cloth') ? 'Textiles & Apparel'
    : lowerDescription.includes('pot') || lowerDescription.includes('vase') || lowerDescription.includes('terracotta') ? 'Pottery & Ceramics'
    : lowerDescription.includes('wood') ? 'Woodwork'
    : lowerDescription.includes('bag') || lowerDescription.includes('wallet') ? 'Bags & Accessories'
    : 'Handicrafts';
  const title = cleanDescription.length > 3 && cleanDescription.length <= 70
    ? cleanDescription.charAt(0).toUpperCase() + cleanDescription.slice(1)
    : `Handcrafted Traditional ${category}`;
  const technique = lowerDescription.includes('pot') ? 'Wheel Thrown & Kiln Fired'
    : lowerDescription.includes('weave') || lowerDescription.includes('saree') ? 'Handloom Weaving'
    : lowerDescription.includes('carv') || lowerDescription.includes('wood') ? 'Hand Carved'
    : lowerDescription.includes('jewel') ? 'Traditional Filigree & Inlay'
    : 'Handmade Craft Technique';
  const origin = lowerDescription.includes('rajasthan') || lowerDescription.includes('jaipur') ? 'Jaipur, Rajasthan'
    : lowerDescription.includes('kashmir') ? 'Kashmir Valley'
    : lowerDescription.includes('varanasi') ? 'Varanasi, Uttar Pradesh'
    : 'Artisan Heritage Cluster, India';

  return {
    title,
    category,
    material,
    color,
    dimensions: '10 x 6 x 4 inches',
    weight: '350 grams',
    origin,
    technique,
    careInstructions: 'Wipe gently with a soft dry cotton cloth. Keep away from excessive moisture.',
    stock: 5,
    descriptionEn: cleanDescription || `Authentic ${title.toLowerCase()} crafted by skilled local artisans using time-honored traditional techniques. Every piece carries the heritage and passion of handmade artistry.`,
    descriptionHi: 'स्थानीय कुशल कारीगरों द्वारा पारंपरिक कला से तैयार किया गया प्रामाणिक हस्तशिल्प उत्पाद। प्रत्येक कृति में भारतीय संस्कृति और हाथों की कला का अनूठा संगम है।',
    keywords: ['handmade', 'artisan product', 'traditional craft', 'made with care', 'indian heritage', 'sustainable art'],
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

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const isTemporaryProviderError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : JSON.stringify(error);
  return /503|unavailable|high demand|temporarily/i.test(message);
};

const requestCatalog = async (imageUrl: string, description: string): Promise<CatalogResponse> => {
  if (!env.GEMINI_API_KEY) return demoCatalog(description);

  const { mimeType, imageData } = await loadImage(imageUrl);
  const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  let result;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      result = await ai.models.generateContent({
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
      break;
    } catch (error) {
      if (!isTemporaryProviderError(error) || attempt === 2) throw error;
      await wait(500 * (attempt + 1));
    }
  }

  if (!result) throw new Error('Gemini did not return a response.');

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
