# Deploying to Netlify

This guide will help you deploy your Next.js application to Netlify.

## Prerequisites

1. A [Netlify account](https://app.netlify.com/signup)
2. Git repository with your code (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Netlify UI

1. Log in to your [Netlify account](https://app.netlify.com/)
2. Click on "New site from Git"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Navigate to your project directory and initialize:
```bash
cd client
netlify init
```

4. Follow the prompts to configure your site
5. Deploy your site:
```bash
netlify deploy --prod
```

## Environment Variables

Make sure to set these environment variables in Netlify:

- `NEXT_PUBLIC_API_URL`: Your backend API URL

You can set environment variables in the Netlify UI under Site settings > Build & deploy > Environment.

## Important Notes

1. The backend must be deployed separately. Consider Heroku, Render, or Firebase hosting for the backend.
2. Update the `NEXT_PUBLIC_API_URL` in the Netlify environment to point to your deployed backend.
3. If you have API routes in your Next.js app, you'll need to use Netlify Functions or serverless functions.

## Troubleshooting

- If you encounter build errors, check the build logs in Netlify.
- Make sure your package.json has the correct build and start scripts.
- If you're using environment variables, ensure they're properly set in Netlify.
- Make sure `@netlify/plugin-nextjs` is properly configured if using Next.js.

## Additional Resources

- [Netlify Docs for Next.js](https://docs.netlify.com/frameworks/next-js/)
- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)
- [Handling environment variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables) 