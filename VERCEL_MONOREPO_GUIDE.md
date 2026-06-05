# Vercel Deployment Guide - Monorepo Setup

## Your Current Structure

```
Space Invaders/
├── vercel.json              ← Backend config
├── server.js                ← Backend entry point
├── package.json             ← Backend dependencies
├── src/                     ← Backend code
└── space-invaders-client/
    ├── vercel.json          ← Frontend config
    ├── package.json         ← Frontend dependencies
    └── src/                 ← Frontend code
```

This is a **monorepo** - one Git repository containing both frontend and backend.

## Vercel Deployment Strategy

You need to create **TWO SEPARATE Vercel projects** from the same GitHub repository:

---

## 🔧 Backend Deployment

### Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Project Name**: `space-invaders-backend`
   - **Root Directory**: `./` (leave as root)
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

4. Click "Deploy"
5. **Save the URL**: `https://space-invaders-backend.vercel.app`

### Via Vercel CLI

```bash
# From the root directory
vercel --prod --name space-invaders-backend
```

**Expected Result**:
- ✅ Backend API accessible at `/api/*` endpoints
- ✅ Server running on Vercel serverless functions

---

## 🎮 Frontend Deployment

### Via Vercel Dashboard

1. Go to https://vercel.com/new
2. **Import the SAME GitHub repository again**
3. Configure:
   - **Project Name**: `space-invaders-frontend`
   - **Root Directory**: `space-invaders-client` ← **IMPORTANT!**
   - **Framework Preset**: Angular (or Other)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/space-invaders-client/browser`
   - **Install Command**: `npm install`

4. Click "Deploy"

### Via Vercel CLI

```bash
# Navigate to frontend directory
cd space-invaders-client

# Deploy
vercel --prod --name space-invaders-frontend
```

**Expected Result**:
- ✅ Frontend accessible at your Vercel URL
- ✅ Game loads and displays properly

---

## 🔗 Connect Frontend to Backend

After both are deployed:

### 1. Update Frontend Environment

Edit `space-invaders-client/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://space-invaders-backend.vercel.app/api'
};
```

Replace `space-invaders-backend.vercel.app` with your actual backend URL.

### 2. Update Backend CORS

Edit `server.js` to allow requests from frontend:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://space-invaders-frontend.vercel.app',  // Add your frontend URL
    'https://*.vercel.app'  // Or allow all Vercel preview deployments
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

### 3. Redeploy Both

```bash
# Commit changes
git add .
git commit -m "chore: connect frontend and backend URLs"
git push

# Or redeploy manually
cd space-invaders-client
vercel --prod

# And backend
cd ..
vercel --prod
```

---

## 🧹 Clean Up Failed Deployments

Delete the failed deployments:

1. Go to https://vercel.com/dashboard
2. Find these projects:
   - `apaceinvaders-frontend`
   - `space-invaders-p6pg`
3. For each:
   - Click on project
   - Settings → Advanced → Delete Project

---

## 📋 Checklist

### Backend Setup
- [ ] Create Vercel project for backend
- [ ] Deploy from root directory
- [ ] Verify `/api/*` endpoints work
- [ ] Note backend URL

### Frontend Setup
- [ ] Create **separate** Vercel project for frontend
- [ ] Set **Root Directory** to `space-invaders-client`
- [ ] Verify build configuration
- [ ] Deploy successfully

### Connection
- [ ] Update `environment.prod.ts` with backend URL
- [ ] Update `server.js` CORS with frontend URL
- [ ] Redeploy both frontend and backend
- [ ] Test end-to-end functionality

---

## 🚨 Common Issues

### Issue: Frontend deployment fails
**Solution**: Make sure **Root Directory** is set to `space-invaders-client`

### Issue: Backend shows frontend code
**Solution**: Backend should use **root directory** (`./`), not `space-invaders-client`

### Issue: API calls fail with CORS error
**Solution**: Add frontend URL to CORS configuration in `server.js`

### Issue: Multiple Vercel projects deploying automatically
**Solution**: 
- Disable auto-deploy on unwanted projects
- Or delete them and create fresh projects with correct settings

---

## 🎯 Alternative: Separate Repositories

If this is too complex, consider splitting into two separate repos:

```
space-invaders-backend/     ← New separate repo
space-invaders-frontend/    ← New separate repo
```

Then deploy each as a single Vercel project. This is simpler but requires managing two repos.

---

## ✅ Verification

After deployment, test:

1. **Backend**: `curl https://YOUR-BACKEND.vercel.app/api/health`
2. **Frontend**: Open `https://YOUR-FRONTEND.vercel.app` in browser
3. **Integration**: Play the game and verify high scores work

---

## 📝 Current Configuration Files

### `/vercel.json` (Backend)
```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server.js" },
    { "src": "/(.*)", "dest": "/server.js" }
  ]
}
```

### `/space-invaders-client/vercel.json` (Frontend)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/space-invaders-client/browser",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Both configurations are correct - they just need to be deployed as **separate Vercel projects**.
