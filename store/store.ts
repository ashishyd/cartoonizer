import { create } from 'zustand';

interface AppState {
  fullName: string;
  socialHandle: string;
  imageUrl: string;
  epamFacts: string[];
  currentFactIndex: number;
  setUserDetails: (details: { fullName: string; socialHandle: string }) => void;
  setImageUrl: (url: string) => void;
  reset: () => void;
  setEpamFacts: (facts: string[]) => void;
  setCurrentFactIndex: (index: number) => void;
}

export const useStore = create<AppState>((set) => ({
  fullName: '',
  socialHandle: '',
  imageUrl: '',
  epamFacts: [],
  currentFactIndex: 0,
  setUserDetails: (details) => set(details),
  setImageUrl: (url) => set({ imageUrl: url }),
  reset: () => set({ fullName: '', socialHandle: '', imageUrl: '' }),
  setEpamFacts: (facts) => set({ epamFacts: facts }),
  setCurrentFactIndex: (index) => set({ currentFactIndex: index }),
}));
