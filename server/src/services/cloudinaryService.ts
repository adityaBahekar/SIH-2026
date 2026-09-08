import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { env } from '../config/env.js';

export interface EnhancedImageResult {
  originalUrl: string;
  enhancedUrl: string;
  publicId: string;
  demoMode: boolean;
}

const isConfigured = (): boolean =>
  Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

if (isConfigured()) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME as string,
    api_key: env.CLOUDINARY_API_KEY as string,
    api_secret: env.CLOUDINARY_API_SECRET as string,
  });
}

const buildEcommerceUrl = (publicId: string): string =>
  cloudinary.url(publicId, {
    secure: true,
    transformation: [
      { effect: 'background_removal' },
      { width: 1200, height: 1200, crop: 'pad', background: 'white' },
      { effect: 'improve:50' },
      { effect: 'viesus_correct' },
      { quality: 'auto:best', fetch_format: 'jpg' },
    ],
  });

export const uploadAndEnhanceImage = async (
  buffer: Buffer,
  mimeType: string,
): Promise<EnhancedImageResult> => {
  const base64DataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;

  if (!isConfigured()) {
    return {
      originalUrl: base64DataUri,
      enhancedUrl: base64DataUri,
      publicId: `demo-${Date.now()}`,
      demoMode: true,
    };
  }

  try {
    const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'sih-artisan/products',
          resource_type: 'image',
          transformation: [{ angle: 'exif' }],
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary upload failed.'));
            return;
          }
          resolve(result);
        },
      );
      stream.end(buffer);
    });

    const enhancedUrl = buildEcommerceUrl(uploaded.public_id);

    return {
      originalUrl: uploaded.secure_url,
      enhancedUrl,
      publicId: uploaded.public_id,
      demoMode: false,
    };
  } catch (error) {
    console.warn(
      '[Cloudinary] Upload failed, falling back to demo mode:',
      error instanceof Error ? error.message : error,
    );
    return {
      originalUrl: base64DataUri,
      enhancedUrl: base64DataUri,
      publicId: `demo-${Date.now()}`,
      demoMode: true,
    };
  }
};
