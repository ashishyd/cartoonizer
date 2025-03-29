'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/store';
import { useEffect } from 'react';

export function FactsCarousel() {
  const { facts, currentFactIndex, setCurrentFactIndex } = useStore();

  useEffect(() => {
    if (facts.length > 0) {
      const timer = setInterval(() => {
        setCurrentFactIndex(currentFactIndex < facts.length - 1 ? currentFactIndex + 1 : 0);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [facts, setCurrentFactIndex]);

  if (facts.length === 0) return null;

  return (
    <div className='w-full max-w-2xl mx-auto mt-8'>
      <div className='relative overflow-hidden h-32'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentFactIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className='absolute inset-0 bg-white rounded-xl p-6 shadow-lg'
          >
            <p className='text-gray-700 text-center text-lg'>
              {facts[currentFactIndex].toString()}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className='flex justify-center gap-2 mt-4'>
        {facts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentFactIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentFactIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
