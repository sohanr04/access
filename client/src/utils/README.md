# Configuration Guide

This directory contains configuration utilities for the application.

## QR Code Production URL

The QR codes generated in the application need to point to your production domain rather than localhost. To configure this:

### Option 1: Update config.js (Quick solution)

1. Open `config.js` in this directory
2. Modify the `PRODUCTION_URL` value to your actual domain:
   ```js
   export const PRODUCTION_URL = 'https://your-actual-domain.com';
   ```

### Option 2: Use Environment Variables (Recommended for production)

1. Create a `.env.production` file in the root of the client directory
2. Add the following line with your domain:
   ```
   VITE_PRODUCTION_URL=https://your-actual-domain.com
   ```
3. When you build the application for production (`npm run build`), this value will be used automatically

## How It Works

When running in development mode (localhost), QR codes will point to your local server for testing.

When deployed to production, QR codes will use either:
1. The value of the `VITE_PRODUCTION_URL` environment variable if available
2. The hardcoded `PRODUCTION_URL` value in `config.js` as a fallback

This ensures your QR codes will always point to the correct URL regardless of where the application is running. 