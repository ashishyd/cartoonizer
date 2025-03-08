<<<<<<< Tabnine <<<<<<<
const withPWA = require('next-pwa')({//-
  dest: 'public',//-
  disable: process.env.NODE_ENV === 'development',//-
});//-
import withPWA from 'next-pwa';//+

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['api.deepai.org'],
    unoptimized: true // Required for PWA offline support
  },
  experimental: {
    optimizePackageImports: ['face-api.js', 'react-webcam']
  }
});
>>>>>>> Tabnine >>>>>>>// {"conversationId":"3897ba42-057a-449f-89b0-a9de3f1c010c","source":"instruct"}