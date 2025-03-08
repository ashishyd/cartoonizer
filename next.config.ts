const path = require('path');

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['api.deepai.org'],
    unoptimized: true, // Required for PWA offline support
  },
  experimental: {
    optimizePackageImports: ['face-api.js', 'react-webcam'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "variables.scss"; @import "mixins.scss";`,
  },
});
