# Render Backend Deployment Guide

## Steps to Deploy Backend on Render:

1. **Go to render.com** and sign up/login
2. **Create New Web Service**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `mood-music-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. **Add Environment Variables**:
   - `SPOTIFY_CLIENT_ID` = your_spotify_client_id
   - `SPOTIFY_CLIENT_SECRET` = your_spotify_client_secret  
   - `GEMINI_API_KEY` = your_gemini_api_key
   - `PORT` = 3001

6. **Deploy!**

## After Backend Deployment:

1. **Copy your Render URL** (e.g., `https://mood-music-backend.onrender.com`)
2. **Update frontend/App.jsx** with your actual Render URL
3. **Update backend/index.js** with your actual Vercel URL
4. **Redeploy both services**

## Final URLs:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
- **API**: https://your-backend.onrender.com/api/recommend