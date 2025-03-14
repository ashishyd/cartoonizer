import { create } from 'zustand';

interface AppState {
  fullName: string;
  socialHandle: string;
  imageUrl: string;
  setUserDetails: (details: { fullName: string; socialHandle: string }) => void;
  setImageUrl: (url: string) => void;
  reset: () => void;
}

export const useStore = create<AppState>((set) => ({
  fullName: '',
  socialHandle: '',
  imageUrl: '',
  setUserDetails: (details) => set(details),
  setImageUrl: (url) => set({ imageUrl: url }),
  reset: () => set({ fullName: '', socialHandle: '', imageUrl: '' }),
}));
