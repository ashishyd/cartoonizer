'use client';

import { create } from 'zustand';
import type { AppError } from '@/types/error';

interface ErrorState {
  error: AppError | null;
  showError: (error: Omit<AppError, 'timestamp'>) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  showError: (error) =>
    set({
      error: { ...error, timestamp: new Date() },
    }),
  clearError: () => set({ error: null }),
}));
