# Vercel Deployment Guide

## Steps to Deploy:

1. **Push to GitHub** (make sure .env is in .gitignore)
2. **Connect to Vercel**:
   - Go to vercel.com
   - Import your GitHub repository
   - Set Framework Preset to "Other"

3. **Add Environment Variables in Vercel**:
   - SPOTIFY_CLIENT_ID=your_client_id
   - SPOTIFY_CLIENT_SECRET=your_client_secret  
   - GEMINI_API_KEY=your_gemini_key

4. **Deploy!**

## Important Files:
- `vercel.json` - Deployment configuration
- `frontend/package.json` - Frontend dependencies
- `backend/index.js` - API endpoints

## URLs after deployment:
- Frontend: https://your-app.vercel.app
- API: https://your-app.vercel.app/api/recommend