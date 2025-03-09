#!/bin/bash

# Install Vercel CLI
npm install -g vercel

# Build the project
npm run build

# Deploy to Vercel
vercel deploy --prod

# Alternative for linked projects:
# vercel --prod