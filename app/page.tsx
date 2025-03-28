'use client';

import { useEffect } from 'react';
import { ErrorBoundary } from '@/components/Error/ErrorBoundary';
import LandingScreen from '@/components/LandingScreen/LandingScreen';
import { ErrorToast } from '@/components/Error/ErrorToast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useUser } from '@/contexts/UserContext';
import OfflinePage from '@/app/offline/page';

export default function Home() {
  const isOnline = useNetworkStatus();
  const { clearUser } = useUser();

  // Clear user context when navigating back to home page
  useEffect(() => {
    clearUser();
  }, [clearUser]);

  return (
    <main className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4'>
      <div className='relative w-full max-w-4xl overflow-hidden rounded-xl bg-white/10 backdrop-blur-md shadow-xl'>
        <div className='transition-transform duration-500 ease-in-out'>
          {isOnline ? (
            <ErrorBoundary>
              <LandingScreen />
              <ErrorToast />
            </ErrorBoundary>
          ) : (
            <OfflinePage />
          )}
        </div>
      </div>
    </main>
  );
}
