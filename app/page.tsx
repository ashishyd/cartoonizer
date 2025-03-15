'use client';

import { ErrorBoundary } from '@/components/Error/ErrorBoundary';
import { LandingScreen } from '@/components/LandingScreen/LandingScreen';
import { appWithTranslation } from 'next-i18next';
import { ErrorToast } from '@/components/Error/ErrorToast';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import '../i18n';
import OfflinePage from '@/app/offline/page';

function Home() {
  const isOnline = useNetworkStatus();

  return (
    <main className='h-screen w-full bg-gray-900'>
      {isOnline ? (
        <ErrorBoundary>
          <LandingScreen />
          <ErrorToast />
        </ErrorBoundary>
      ) : (
        <OfflinePage />
      )}
    </main>
  );
}

export default appWithTranslation(Home);
