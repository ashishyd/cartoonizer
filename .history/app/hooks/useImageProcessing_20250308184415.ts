import { useState, useEffect } from 'react';
import { addLogo, optimizeImage } from '../lib/imageUtils';

export function useImageProcessing() {
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const processImage = async (imageSrc: string) => {
    try {
      setProgress(20);

      const cartoonResponse = await fetch('/api/cartoonify', {
        method: 'POST',
        body: JSON.stringify({ image: imageSrc }),
        headers: { 'Content-Type': 'application/json' },
      });
      setProgress(60);

      const { output_url } = await cartoonResponse.json();
      const optimizedImage = await optimizeImage(output_url);
      setProgress(80);

      const brandedImage = await addLogo(optimizedImage, '/brand-logo.png');
      setProgress(100);

      setProcessedImage(brandedImage);
    } catch (error) {
      console.error('Processing failed:', error);
      throw error;
    }
  };

  return { processedImage, progress, processImage };
}
