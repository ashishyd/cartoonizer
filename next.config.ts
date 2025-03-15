import next_pwa from 'next-pwa';

import { i18n } from './next-i18next.config';

const withPWA = next_pwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
});

module.exports = withPWA({
  i18n,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'api.deepai.org' }],
    unoptimized: true, // Required for PWA offline support
  },
  experimental: {
    optimizePackageImports: ['face-api.js', 'react-webcam'],
  },
});
