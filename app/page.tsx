'use client';

import { ErrorBoundary } from './components/Error/ErrorBoundary';
import { LandingScreen } from '@/app/components/LandingScreen/LandingScreen';
import { appWithTranslation } from 'next-i18next';
import '../i18n';

function Home() {
  return (
    <main className='h-screen w-full bg-gray-900'>
      <ErrorBoundary>
        <LandingScreen />
      </ErrorBoundary>
    </main>
  );
}

export default appWithTranslation(Home);
