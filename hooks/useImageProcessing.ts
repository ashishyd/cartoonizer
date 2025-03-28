import { useState } from 'react';
import { addLogo, optimizeImage } from '@/lib/imageUtils';
import { useStore } from '@/store/store';
import { useErrorStore } from '@/store/errorStore';
import { AppLogger } from '@/lib/logger';

export function useImageProcessing() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { fullName, socialHandle, setImageUrl } = useStore();
  const { showError } = useErrorStore();

  const processImage = async (image: string) => {
    try {
      setProgress(20);

      const cartoonResponse = await fetch('/api/cartoonify', {
        method: 'POST',
        body: JSON.stringify({ image }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!cartoonResponse.ok) {
        throw new Error('Failed to cartoonify image');
      }
      setProgress(60);

      const { output_url } = await cartoonResponse.json();
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(output_url)}`;
      const optimizedImage = await optimizeImage(proxyUrl);
      setProgress(80);

      const brandedImage = await addLogo(optimizedImage, '/brand-logo.png', fullName, socialHandle);
      setProgress(100);

      setProcessedImage(brandedImage);
      setImageUrl(brandedImage);
    } catch (error) {
      if (error instanceof Error) {
        showError({
          code: 'processing/image-error',
          message: 'Failed to process the image. Please try again.',
          context: { stack: error.stack },
        });
        AppLogger.logError({
          code: 'processing/image-error',
          message: error.message,
          context: { stack: error.stack },
          timestamp: new Date(),
        });
      }
      throw error;
    }
  };

  return { processedImage, progress, processImage };
}
