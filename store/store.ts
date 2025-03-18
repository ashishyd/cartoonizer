import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import { Event } from '@/types/event';
import { Auth } from '@/types/auth';
import { Fact } from '@/types/fact';
import { SocialPlatform } from '@/types/socialPlatform';
import { UserSocial } from '@/types/userSocial';
import { UserEvent } from '@/types/userEvent';

export interface AppState {
  user: User;
  userSocial: UserSocial;
  userEvent: UserEvent;
  event: Event;
  auth?: Auth;
  imageUrl: string;
  facts: Fact[];
  currentFactIndex: number;
  socialPlatforms: SocialPlatform[];
  setUserDetails: (user: User) => void;
  setUserSocial: (userSocial: UserSocial) => void;
  setUserEvent: (userEvent: UserEvent) => void;
  setImageUrl: (url: string) => void;
  reset: () => void;
  setFacts: (facts: Fact[]) => void;
  setCurrentFactIndex: (index: number) => void;
  setSocialPlatforms: (platforms: SocialPlatform[]) => void;
  setEvent: (event: Event) => void;
}

export const useStore = create<AppState>((set) => ({
  user: { full_name: '', email: '' },
  userSocial: { platformId: BigInt(0), handle: '', userId: BigInt(0) },
  userEvent: { eventId: BigInt(0), attempts: 0, userId: BigInt(0) },
  event: {
    id: BigInt(0),
    name: '',
    start_date: '',
    end_date: '',
    show_registration: false,
    per_user_limit: 0,
  },
  imageUrl: '',
  facts: [],
  socialPlatforms: [],
  currentFactIndex: 0,
  setUserDetails: (user) => set({ user }),
  setUserSocial: (userSocial) => set({ userSocial }),
  setUserEvent: (userEvent) => set({ userEvent }),
  setImageUrl: (url) => set({ imageUrl: url }),
  reset: () => set({ imageUrl: '' }),
  setFacts: (facts) => set({ facts }),
  setCurrentFactIndex: (index) => set({ currentFactIndex: index }),
  setSocialPlatforms: (platforms) => set({ socialPlatforms: platforms }),
  setEvent: (event) => set({ event }),
}));

export const fetchEvent = async (eventName: string) => {
  const { data, error } = await supabase
    .from('event')
    .select('id, name, description, start_date, end_date, show_registration, per_user_limit')
    .eq('name', eventName)
    .gte('start_date', new Date().toISOString())
    .lte('end_date', new Date().toISOString())
    .single();

  if (data) {
    useStore.getState().setEvent(data as Event);
  }

  return { data, error };
};

export const fetchSocialPlatforms = async () => {
  const { data, error } = await supabase
    .from('social_platform')
    .select('id, name')
    .order('name', { ascending: true });

  if (data) {
    useStore.getState().setSocialPlatforms(data as SocialPlatform[]);
  }

  return { data, error };
};
