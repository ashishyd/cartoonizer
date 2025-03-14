import { useState } from 'react';
import { addLogo, optimizeImage } from '../lib/imageUtils';
import { useStore } from '@/app/store';

export function useImageProcessing() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { fullName, socialHandle, setImageUrl } = useStore();

  const processImage = async (image: string) => {
    try {
      setProgress(20);

      const cartoonResponse = await fetch('/api/cartoonify', {
        method: 'POST',
        body: JSON.stringify({ image }),
        headers: { 'Content-Type': 'application/json' },
      });
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
      console.error('Processing failed:', error);
      throw error;
    }
  };

  return { processedImage, progress, processImage };
}
