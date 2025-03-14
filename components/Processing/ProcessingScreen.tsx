'use client';

import { motion } from 'framer-motion';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { useErrorStore } from '@/store/errorStore';
import { AppLogger } from '@/lib/logger';

export function ProcessingScreen() {
  const { processImage, progress } = useImageProcessing();
  const router = useRouter();
  const { imageUrl } = useStore();
  const { showError } = useErrorStore();
  const hasProcessed = useRef(false);

  const process = async () => {
    try {
      await processImage(imageUrl);
      router.push('/result');
    } catch (err) {
      if (err instanceof Error) {
        showError({
          code: 'processing/image-error',
          message: 'Failed to process the image. Please try again.',
          context: { stack: err.stack },
        });
        AppLogger.logError({
          code: 'processing/image-error',
          message: err.message,
          context: { stack: err.stack },
          timestamp: new Date(),
        });
      }
    }
  };

  useEffect(() => {
    if (!hasProcessed.current) {
      hasProcessed.current = true;
      process();
    }

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return (
    <div className='h-screen w-full bg-gray-900 flex flex-col items-center justify-center gap-8'>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className='w-24 h-24 border-4 border-t-white/80 border-r-white/60 border-b-white/40 border-l-white/20 rounded-full'
      />

      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-bold text-white'>Creating Your Cartoon</h2>
        <p className='text-white/60'>{Math.round(progress)}% Complete</p>
      </div>
    </div>
  );
}
