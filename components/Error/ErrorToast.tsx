'use client';

import { useErrorStore } from '@/store/errorStore';
import { AnimatePresence, motion } from 'framer-motion';

export function ErrorToast() {
  const { error, clearError } = useErrorStore();

  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className='fixed bottom-8 right-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-4'
        >
          <div>
            <h3 className='font-semibold'>{error.code}</h3>
            <p className='text-sm'>{error.message}</p>
          </div>
          <button
            onClick={clearError}
            className='text-red-500 hover:text-red-700'
            aria-label='Dismiss error'
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
