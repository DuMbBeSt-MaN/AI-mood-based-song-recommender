# AI Mood Music Recommender

An AI-powered music recommendation app that analyzes your mood using Google's Gemini API and suggests songs from Spotify based on your emotional state.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Get API Keys

**Spotify API:**
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy your Client ID and Client Secret

**Gemini API:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key

### 3. Configure Environment Variables
Update the `.env` file with your API keys:
```
SPOTIFY_CLIENT_ID=your_actual_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_actual_spotify_client_secret
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=3001
```

### 4. Run the Application

**Start the backend server:**
```bash
npm run server
```

**In a new terminal, start the frontend:**
```bash
npm run dev
```

The app will be available at:
- Frontend: https://ai-mood-based-song-recommender-yn86-ly59a8fui.vercel.app/
- Backend: https://ai-mood-based-song-recommender-2.onrender.com

## How It Works

1. **Mood Input**: Describe your current mood or feelings
2. **AI Analysis**: Gemini API analyzes your mood and extracts musical characteristics
3. **Song Matching**: Spotify API finds songs that match your mood's energy, valence, and genre preferences
4. **Recommendations**: Get personalized song recommendations with previews and Spotify links

## Features

- Real-time mood analysis using AI
- Spotify integration for music recommendations
- Audio previews for recommended songs
- Beautiful gradient UI with glassmorphism design
- Responsive design for all devices
