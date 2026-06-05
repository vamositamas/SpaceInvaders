# Vercel Environment Variables Setup

## Backend Project (space-invaders-backend)

Add these environment variables in your Vercel dashboard:

### Required Variables

1. **NODE_ENV**
   - Value: `production`
   - Description: Sets the environment to production mode

2. **ALLOWED_ORIGINS**
   - Value: `http://localhost:4200,https://YOUR-FRONTEND-URL.vercel.app,https://*.vercel.app`
   - Description: Comma-separated list of allowed CORS origins
   - **Important**: Replace `YOUR-FRONTEND-URL` with your actual frontend Vercel URL after deployment

### How to Add Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your backend project (`space-invaders-backend`)
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `ALLOWED_ORIGINS`)
   - **Value**: Variable value
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**
6. Redeploy the project for changes to take effect

---

## Frontend Project (space-invaders-frontend)

### After Backend is Deployed

1. Deploy backend first and note the URL
2. Update `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://YOUR-ACTUAL-BACKEND-URL.vercel.app/api'
   };
   ```
3. Commit and push to trigger frontend deployment

### Optional: Use Vercel Environment Variables

If you want to use environment variables for the frontend URL:

1. In Vercel dashboard → Frontend project → Settings → Environment Variables
2. Add:
   - **Key**: `VITE_API_URL` or `NG_APP_API_URL`
   - **Value**: `https://YOUR-BACKEND-URL.vercel.app/api`
3. Update your Angular configuration to use this variable

**Note**: Angular doesn't support runtime environment variables by default. The simpler approach is to update the `environment.prod.ts` file directly.

---

## Deployment Sequence

1. ✅ Deploy backend with environment variables
2. ✅ Note the backend URL
3. ✅ Update frontend `environment.prod.ts` with backend URL
4. ✅ Update backend `ALLOWED_ORIGINS` to include frontend URL
5. ✅ Redeploy both services
6. ✅ Test the connection

---

## Testing

After deployment:

```bash
# Test backend health
curl https://YOUR-BACKEND-URL.vercel.app/health

# Test API endpoint
curl https://YOUR-BACKEND-URL.vercel.app/api/highscores
```

Open frontend in browser and check:
- Game loads ✅
- API calls work (check browser console) ✅
- High scores can be saved ✅
