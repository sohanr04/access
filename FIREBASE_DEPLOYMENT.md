# Firebase Deployment Guide

This guide explains how to deploy both the frontend and backend of your application to Firebase.

## Prerequisites

1. [Firebase account](https://firebase.google.com/)
2. [Firebase CLI](https://firebase.google.com/docs/cli) installed
   ```bash
   npm install -g firebase-tools
   ```
3. Your existing Firebase project (or create a new one)

## Setup

### 1. Login to Firebase

```bash
firebase login
```

### 2. Initialize Firebase in Your Project

```bash
firebase init
```

Select these options when prompted:
- **Which Firebase features do you want to set up?**
  - Firestore
  - Functions
  - Hosting
  - Storage

- **Associate with existing project:**
  - Select your Firebase project

- **What file should be used for Firestore Rules?**
  - Accept the default (firestore.rules)

- **What file should be used for Firestore indexes?**
  - Accept the default (firestore.indexes.json)

- **What language would you like to use to write Cloud Functions?**
  - JavaScript

- **Do you want to use ESLint?**
  - No

- **Do you want to install dependencies with npm now?**
  - Yes

- **What do you want to use as your public directory?**
  - client/.next

- **Configure as a single-page app?**
  - Yes

- **Set up automatic builds and deploys with GitHub?**
  - No (or Yes if you want CI/CD)

### 3. Prepare Your Backend for Firebase Functions

Create a function wrapper for your Express app:

1. Create a new file at `functions/index.js`:

```bash
mkdir -p functions
```

2. Add the following content to `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const serverApp = require('../src/server');

// This will allow the Firebase Functions to use your Express app
exports.api = functions.https.onRequest(serverApp);
```

3. Update the `firebase.json` configuration:

```json
{
  "hosting": {
    "public": "client/.next",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "."
  }
}
```

### 4. Update Frontend API URL

Update your API configuration in `client/src/api/sampleApi.js` to use relative URLs:

```javascript
const API_URL = '/api';
```

### 5. Build Your Frontend

```bash
cd client
npm run build
```

### 6. Deploy to Firebase

From the root of your project:

```bash
firebase deploy
```

This will deploy:
- Your Next.js frontend to Firebase Hosting
- Your Express API to Firebase Functions
- Your Firestore database rules

## Environment Variables

You'll need to set environment variables for your Firebase Functions:

```bash
firebase functions:config:set firebase.apikey="YOUR_API_KEY" firebase.authdomain="YOUR_AUTH_DOMAIN" firebase.projectid="YOUR_PROJECT_ID" firebase.storagebucket="YOUR_STORAGE_BUCKET"
```

## Accessing Your Deployed App

After deployment, you can access your application at:
- Frontend: `https://your-project-id.web.app` or `https://your-project-id.firebaseapp.com`
- API: `https://your-project-id.web.app/api` or through Firebase Functions directly

## Troubleshooting

- **CORS issues**: Ensure CORS is properly configured in your Express app
- **Function timeout**: Firebase Functions has a timeout of 60 seconds for free tier
- **Memory limits**: Free tier has 256MB memory limit
- **Cold starts**: Functions may have cold start delays

## Benefits of Firebase Hosting

1. **Single platform**: Host both frontend and backend on the same platform
2. **Free tier**: Generous free tier for hosting, functions, and Firestore
3. **Automatic HTTPS**: All deployments come with free SSL certificates
4. **Global CDN**: Your static assets are distributed globally
5. **Integration**: Seamless integration with other Firebase services

## Additional Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore) 