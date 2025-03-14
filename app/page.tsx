'use client';

import { ErrorBoundary } from '@/components/Error/ErrorBoundary';
import { LandingScreen } from '@/components/LandingScreen/LandingScreen';
import { appWithTranslation } from 'next-i18next';
import '../i18n';
import { ErrorToast } from '@/components/Error/ErrorToast';

function Home() {
  return (
    <main className='h-screen w-full bg-gray-900'>
      <ErrorBoundary>
        <LandingScreen />
        <ErrorToast />
      </ErrorBoundary>
    </main>
  );
}

export default appWithTranslation(Home);
