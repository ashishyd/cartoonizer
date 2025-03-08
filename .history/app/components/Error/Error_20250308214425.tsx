'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ErrorProps = {
  error: Error & { digest?: string };
  reset?: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl space-y-6">
        <div className="animate-bounce">
          <span className="text-8xl">⚠️</span>
        </div>
        
        <h1 className="text-4xl font-bold text-white">Something Went Wrong</h1>
        
        <div className="space-y-4 text-gray-300">
          <p className="text-lg">
            {error.message || 'An unexpected error occurred'}
          </p>
          
          {error.digest && (
            <p className="text-sm bg-black/20 p-2 rounded">
              Error ID: <code className="font-mono">{error.digest}</code>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {reset && (
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 border-2 border-white/40 hover:border-white/60 text-white rounded-lg transition-all"
          >
            Return Home
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If the problem persists, contact support with the error ID above.</p>
        </div>
      </div>
    </div>
  );
}