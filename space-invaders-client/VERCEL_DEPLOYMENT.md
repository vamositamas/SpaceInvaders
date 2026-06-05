# Deploying Space Invaders to Vercel

This guide explains how to deploy the Space Invaders application to Vercel.

## Architecture

The application has two parts:
1. **Frontend** (Angular app in `space-invaders-client/`) - Client-side game interface
2. **Backend** (Express server in root `/`) - API for high scores, game state, WebSocket

## Deployment Options

### Option 1: Deploy Frontend and Backend Separately (Recommended)

This is the recommended approach for Vercel as it follows best practices.

#### Step 1: Deploy the Backend

1. Create a new Vercel project for the backend:
   ```bash
   cd /path/to/Space\ Invaders
   vercel
   ```

2. Configure the project:
   - Select "Space Invaders Backend" as project name
   - Use the root directory
   - Framework: "Other"
   - Build command: (leave empty)
   - Output directory: (leave empty)

3. Note the deployed URL (e.g., `https://space-invaders-backend.vercel.app`)

4. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add any required environment variables from your `.env` file

#### Step 2: Deploy the Frontend

1. Update the backend URL in the frontend:
   ```bash
   cd space-invaders-client
   ```

2. Edit `src/environments/environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://YOUR_BACKEND_DOMAIN.vercel.app/api'
   };
   ```
   Replace `YOUR_BACKEND_DOMAIN` with your actual backend URL.

3. Deploy the frontend:
   ```bash
   vercel
   ```

4. Configure the project:
   - Select "Space Invaders Frontend" as project name
   - Use the `space-invaders-client` directory
   - Framework: "Angular"
   - Build command: `npm run build`
   - Output directory: `dist/space-invaders-client`

#### Step 3: Update CORS Settings

Update the backend CORS configuration to allow requests from your frontend domain:

In `server.js`, update the CORS configuration:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://YOUR_FRONTEND_DOMAIN.vercel.app'
  ],
  credentials: true
};
app.use(cors(corsOptions));
```

Redeploy the backend after making this change.

### Option 2: Deploy Frontend Only (Static Hosting)

If you want to deploy just the frontend without the backend features (no high scores, multiplayer, etc.):

1. Go to `space-invaders-client` directory
2. Run `vercel`
3. The game will work in single-player mode only

## Important Configuration Files

### Frontend Configuration (`space-invaders-client/vercel.json`)
- Configures Angular build settings
- Sets up routing for SPA
- Defines cache headers

### Backend Configuration (`vercel.json`)
- Configures Node.js server
- Routes API requests to Express

## Troubleshooting

### 404 Error on Frontend
**Cause**: Vercel isn't configured to serve the Angular app properly.
**Solution**: Ensure `vercel.json` exists in `space-invaders-client/` with proper configuration.

### CORS Errors
**Cause**: Backend doesn't allow requests from frontend domain.
**Solution**: Update CORS configuration in `server.js` to include frontend domain.

### API Calls Failing
**Cause**: Frontend is pointing to wrong backend URL.
**Solution**: Update `src/environments/environment.prod.ts` with correct backend URL.

### WebSocket Connection Issues
**Cause**: Vercel has limited WebSocket support.
**Solution**: Consider using Vercel's serverless functions or deploy backend to a platform with full WebSocket support (e.g., Render, Railway).

## Build Commands

### Frontend
```bash
cd space-invaders-client
npm install
npm run build
```
Output: `dist/space-invaders-client/`

### Backend
```bash
npm install
npm start
```

## Environment Variables

### Backend
Create these in Vercel dashboard for the backend project:
- `NODE_ENV=production`
- Any other environment variables from your `.env` file

### Frontend
If using environment variables, create these in Vercel dashboard:
- (Currently not needed, but can be added for API URL)

## Post-Deployment

1. Test the frontend at your Vercel URL
2. Verify API calls are working
3. Check browser console for any errors
4. Test game functionality (start game, high scores, etc.)

## Limitations on Vercel

- **WebSocket Support**: Limited to 300 seconds on Hobby plan
- **Serverless Functions**: 10-second timeout on Hobby plan
- **Cold Starts**: First request may be slower due to serverless nature

For production with real-time features, consider:
- **Vercel Pro** (longer timeouts)
- **Alternative platforms** for backend (Render, Railway, Heroku)
- **Dedicated WebSocket service** (Pusher, Ably)

## Next Steps

1. Deploy backend to Vercel
2. Note the backend URL
3. Update frontend environment configuration
4. Deploy frontend to Vercel
5. Test the application
6. Configure custom domain (optional)

## Useful Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs

# List deployments
vercel ls
```

## Support

For issues:
1. Check Vercel deployment logs
2. Review browser console errors
3. Verify environment configuration
4. Check CORS settings
