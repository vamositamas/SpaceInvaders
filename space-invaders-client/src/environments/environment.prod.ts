/**
 * Production environment configuration
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Deploy backend to Vercel first
 * 2. Note the backend URL (e.g., https://space-invaders-backend.vercel.app)
 * 3. Replace 'YOUR_BACKEND_URL' below with your actual backend URL
 * 4. Commit and deploy frontend
 * 
 * Example: apiUrl: 'https://space-invaders-backend.vercel.app/api'
 */
export const environment = {
  production: true,
  apiUrl: 'https://YOUR_BACKEND_URL.vercel.app/api'  // TODO: Replace with your actual backend URL after deployment
};
