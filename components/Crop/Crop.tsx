'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { useErrorStore } from '@/store/errorStore';
import { AppLogger } from '@/lib/logger';
import Image from 'next/image';

export function Crop() {
  const router = useRouter();
  const { setImageUrl, imageUrl } = useStore();
  const { showError } = useErrorStore();

  const [crop, setCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getCroppedImage = useCallback(async () => {
    const image = imgRef.current;
    if (!image || !crop?.width || !crop?.height) return;

    setIsProcessing(true);
    try {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const canvas = document.createElement('canvas');
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const croppedImage = canvas.toDataURL('image/jpeg');
      setImageUrl(croppedImage);
      router.push('/processing');
    } catch (err) {
      if (err instanceof Error) {
        showError({
          code: 'crop/cropping-error',
          message: 'Cropping failed. Please try again.',
          context: { stack: err.stack },
        });
        AppLogger.logError({
          code: 'crop/cropping-error',
          message: err.message,
          context: { stack: err.stack },
          timestamp: new Date(),
        });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [crop, setImageUrl, router]);

  return (
    <div className='flex flex-col h-screen bg-gray-900 p-4'>
      <div className='flex-1 flex items-center justify-center'>
        <div className='w-full max-w-md relative'>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={1}
            className='border-2 border-white/20 rounded-lg overflow-hidden'
          >
            <Image ref={imgRef} src={imageUrl} alt='Edit' className='object-contain max-h-[60vh]' />
          </ReactCrop>

          <div className='absolute top-2 left-2 text-white/80 text-sm bg-black/50 px-2 py-1 rounded'>
            Drag to adjust crop
          </div>
        </div>
      </div>

      <div className='mt-4 p-4 bg-gray-800 rounded-lg flex flex-col sm:flex-row gap-4 items-center justify-between'>
        <button
          onClick={() => window.history.back()}
          className='px-6 py-2 text-white/80 hover:text-white transition-colors'
        >
          Cancel
        </button>

        <div className='flex items-center gap-2 text-sm text-white/80'>
          <span className='hidden sm:inline'>←</span>
          <span>Select area to crop</span>
          <span className='hidden sm:inline'>→</span>
        </div>

        <button
          onClick={getCroppedImage}
          disabled={!crop || isProcessing}
          className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[120px]'
        >
          {isProcessing ? (
            <span className='flex items-center justify-center gap-2'>
              <span className='animate-spin'>↻</span>
              Processing...
            </span>
          ) : (
            'Apply Crop'
          )}
        </button>
      </div>
    </div>
  );
}
