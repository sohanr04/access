# Netlify Deployment Guide

This guide explains how to deploy both the frontend and backend of your application to Netlify.

## Prerequisites

1. A [Netlify account](https://app.netlify.com/signup)
2. Git repository with your code (GitHub, GitLab, or Bitbucket)
3. [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed (optional for command-line deployment)

## Deployment Overview

This project consists of:
1. A Next.js frontend in the `client/` directory
2. A Node.js/Express backend API in the `src/` directory

## Frontend Deployment

### Option 1: Deploy via Netlify UI

1. Log in to your [Netlify account](https://app.netlify.com/)
2. Click on "New site from Git"
3. Connect to your Git provider and select your repository
4. Configure build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (if deployed separately)
6. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI if you haven't already:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize and deploy from the project root:
```bash
netlify init
# Follow the prompts to configure your site
netlify deploy --prod
```

## Backend Deployment Options

### Option 1: Deploy Backend Separately

You can deploy the backend to a separate hosting service:

1. Heroku, Render, Railway, or similar Node.js hosting platform
2. Configure the frontend's `NEXT_PUBLIC_API_URL` to point to your deployed backend
3. Ensure CORS is properly configured in your backend code

### Option 2: Deploy as Netlify Functions

To deploy the backend as Netlify Functions:

1. Create a `netlify/functions` directory in your project
2. Create an API proxy function:

```bash
mkdir -p netlify/functions
```

3. Create an `api.js` file in the `netlify/functions` directory:

```javascript
// netlify/functions/api.js
const express = require('express');
const serverless = require('serverless-http');
const app = express();

// Import your existing routes and middleware
const { app: mainApp } = require('../../src/server');

// Use your existing app
app.use('/.netlify/functions/api', mainApp);

// Export the serverless function
module.exports.handler = serverless(app);
```

4. Install required dependencies:
```bash
npm install --save serverless-http
```

5. Update your `netlify.toml` to redirect API requests to the function:
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

## Environment Variables

Set these environment variables in Netlify:

1. For the frontend:
   - `NEXT_PUBLIC_API_URL`: URL to your backend API

2. For Firebase (if using Netlify Functions):
   - `FIREBASE_API_KEY`: Your Firebase API key
   - `FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket

## Troubleshooting

- If you encounter build errors, check the build logs in Netlify
- For Next.js issues, ensure `@netlify/plugin-nextjs` is installed and configured
- For API connection issues, check CORS settings and environment variables

## Additional Resources

- [Netlify Docs for Next.js](https://docs.netlify.com/frameworks/next-js/)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Serverless HTTP for Express](https://github.com/dougmoscrop/serverless-http) 