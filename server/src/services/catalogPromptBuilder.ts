export const buildCatalogPrompt = (description: string): string => `You are an e-commerce catalog assistant for traditional artisans. Analyze the provided product image together with the artisan's description.

Generate concise, professional, truthful catalog information. Never invent details. Prefer information explicitly stated by the artisan. Use visual information only when sufficiently obvious. Return null for uncertain material or color. Do not invent dimensions, location, certifications, awards, or historical claims.

Produce natural English and Hindi descriptions suitable for an online marketplace. The English description should be 40 to 80 words. Return 5 to 10 useful keywords.

Artisan description: ${description}

Return only JSON matching this shape:
{
  "title": "string",
  "category": "string",
  "material": "string or null",
  "color": "string or null",
  "descriptionEn": "string",
  "descriptionHi": "string",
  "keywords": ["string"],
  "aiConfidence": 0.0
}`;
