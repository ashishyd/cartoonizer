import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import type React from 'react';
import BannerScreen from '@/components/BannerScreen/BannerScreen';
import { UserProvider } from '@/contexts/UserContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cartoonizer - Transform Your Photos',
  description: 'Create fun cartoon avatars from your photos instantly',
  manifest: '/manifest.json',
  themeColor: '#4338ca',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cartoonizer',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    type: 'website',
    title: 'Cartoonizer - Transform Your Photos',
    description: 'Create fun cartoon avatars from your photos instantly',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full'>
      <head>
        {/* Add PWA manifest */}
        <link rel='manifest' href='/manifest.json' />

        {/* Add Apple touch icons */}
        <link rel='apple-touch-icon' href='/icons/apple-icon-180.png' />
        <meta name='apple-mobile-web-app-capable' content='yes' />

        {/* Add service worker registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker
                    .register('/sw.js')
                    .then(registration => {
                      console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch(err => console.error('Service Worker registration failed:', err))
                })
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden font-sans`}
      >
        <UserProvider>
          <div className='relative h-full overflow-hidden'>
            {/* Pastel-colored animated background */}
            <div className='fixed inset-0 -z-10'>
              {/* Base pastel gradient */}
              <div className='absolute inset-0 bg-gradient-to-br from-[#f9d1ff] via-[#c5f8ff] to-[#ffeacc]'></div>

              {/* Soft pattern overlay */}
              <div
                className='absolute inset-0 opacity-10'
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%236b7280' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              ></div>

              {/* Pastel animated floating blobs */}
              <div className='absolute inset-0 overflow-hidden'>
                {/* Large central blob */}
                <div className='absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#ffb6e1] via-[#ffd1c2] to-[#c5e0ff] opacity-30 blur-3xl animate-blob'></div>

                {/* Top-left blob */}
                <div className='absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#c5f8ff] to-[#d9c5ff] opacity-30 blur-3xl animate-blob animation-delay-2000'></div>

                {/* Bottom-right blob */}
                <div className='absolute -bottom-64 -right-64 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#ffd1c2] to-[#fffdc2] opacity-30 blur-3xl animate-blob animation-delay-4000'></div>

                {/* Small accent blobs */}
                <div
                  className='absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-[#c2ffd9] to-[#c5f8ff] opacity-30 blur-3xl animate-ping'
                  style={{ animationDuration: '8s' }}
                ></div>
                <div
                  className='absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-r from-[#fffdc2] to-[#ffd1c2] opacity-30 blur-3xl animate-ping'
                  style={{ animationDuration: '10s', animationDelay: '1s' }}
                ></div>
              </div>

              {/* Cartoon-themed elements */}
              <div className='absolute inset-0'>
                {/* Scattered pastel polka dots */}
                <div className='absolute top-[10%] left-[15%] w-6 h-6 rounded-full bg-[#ffb6e1] opacity-30'></div>
                <div className='absolute top-[20%] right-[25%] w-8 h-8 rounded-full bg-[#c5f8ff] opacity-30'></div>
                <div className='absolute top-[40%] left-[30%] w-4 h-4 rounded-full bg-[#c2ffd9] opacity-30'></div>
                <div className='absolute bottom-[30%] right-[10%] w-10 h-10 rounded-full bg-[#fffdc2] opacity-30'></div>
                <div className='absolute bottom-[10%] left-[40%] w-5 h-5 rounded-full bg-[#d9c5ff] opacity-30'></div>

                {/* Cartoon-style stars */}
                <div
                  className='absolute top-[15%] right-[15%] w-8 h-8 opacity-20 animate-pulse'
                  style={{ animationDuration: '3s' }}
                >
                  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'
                      fill='#ffb6e1'
                    />
                  </svg>
                </div>
                <div
                  className='absolute bottom-[25%] left-[20%] w-6 h-6 opacity-20 animate-pulse'
                  style={{ animationDuration: '4s', animationDelay: '1s' }}
                >
                  <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z'
                      fill='#c5f8ff'
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Main content */}
            <main className='flex w-full z-10 h-full'>
              {/* Left side - Banner screen (always visible) */}
              <div className='w-1/2 h-full overflow-auto'>
                <BannerScreen />
              </div>

              {/* Right side - Dynamic content based on route */}
              <div className='w-1/2 h-full overflow-auto'>{children}</div>
            </main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
