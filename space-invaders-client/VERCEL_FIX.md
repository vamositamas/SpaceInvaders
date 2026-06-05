# Quick Fix for Vercel Frontend Deployment

## The Issue
Your frontend deployment is failing because Vercel doesn't have the correct build configuration.

## What I Fixed
1. ✅ Updated `vercel.json` with proper build settings
2. ✅ Set correct output directory: `dist/space-invaders-client/browser`
3. ✅ Added build command: `npm run build`
4. ✅ Configured routing for Angular SPA

## How to Deploy Now

### Option 1: Via Vercel CLI (Recommended)

```bash
# Navigate to the frontend directory
cd space-invaders-client

# Deploy to Vercel
vercel --prod
```

When prompted:
- **Set up and deploy?** Yes
- **Which scope?** Select your account
- **Link to existing project?** 
  - If you have "apaceinvaders-frontend" or "space-invaders-p6pg", select Yes and choose one
  - Otherwise, select No to create new project
- **Project name?** space-invaders-frontend (or your preferred name)
- **Directory?** ./ (current directory)
- **Override settings?** No

### Option 2: Via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Root Directory**: Select `space-invaders-client`
5. **Framework Preset**: Other (or None)
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist/space-invaders-client/browser`
8. Click "Deploy"

### Option 3: Git Push (If Connected to GitHub)

```bash
# Make sure changes are committed
git add space-invaders-client/vercel.json
git commit -m "fix: update Vercel configuration for frontend deployment"
git push
```

Vercel will automatically redeploy if your project is connected to GitHub.

## Verify the Build Works Locally

Before deploying, test the build:

```bash
cd space-invaders-client
npm run build
```

You should see:
- ✅ Build successful
- ✅ Output in `dist/space-invaders-client/browser/`
- ✅ `index.html` exists in the output directory

## Delete Failed Deployments

To clean up the failed deployments:

1. Go to https://vercel.com/dashboard
2. Find "apaceinvaders-frontend" and "space-invaders-p6pg" projects
3. Go to Project Settings → Advanced
4. Click "Delete Project"

Then create a fresh deployment using Option 1 or 2 above.

## Expected Result

After deployment, you should see:
- ✅ Green deployment status
- ✅ Frontend accessible at your Vercel URL
- ✅ Game menu loads properly
- ⚠️ API calls may fail (need backend deployment)

## Next: Connect to Backend

Once frontend is deployed, you'll need to:
1. Deploy the backend separately (see `VERCEL_DEPLOYMENT.md`)
2. Update `src/environments/environment.prod.ts` with backend URL
3. Redeploy frontend

## Troubleshooting

### Still getting 404?
- Check Vercel build logs for errors
- Verify output directory contains `index.html`
- Ensure `vercel.json` is in the `space-invaders-client` directory

### Build fails?
- Run `npm install` in `space-invaders-client` directory
- Check for TypeScript errors: `npm run build`
- Review Vercel build logs

### Wrong directory deployed?
- Make sure Root Directory in Vercel is set to `space-invaders-client`
- Or deploy from the `space-invaders-client` directory using CLI

## Current Configuration

Your `space-invaders-client/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/space-invaders-client/browser",
  "framework": null,
  "rewrites": [...],
  "headers": [...]
}
```

This tells Vercel:
- How to build: `npm run build`
- Where to find files: `dist/space-invaders-client/browser`
- How to route: All routes → `index.html` (SPA mode)
