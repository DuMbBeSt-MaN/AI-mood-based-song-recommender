import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Use config as fallback
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || config.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || config.SPOTIFY_CLIENT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || config.GEMINI_API_KEY;
const PORT = process.env.PORT || config.PORT;

// Debug environment variables
console.log('Environment check:');
console.log('SPOTIFY_CLIENT_ID:', SPOTIFY_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('SPOTIFY_CLIENT_SECRET:', SPOTIFY_CLIENT_SECRET ? 'SET' : 'NOT SET');
console.log('GEMINI_API_KEY:', GEMINI_API_KEY ? 'SET' : 'NOT SET');
console.log('PORT:', PORT);

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://ai-mood-based-song-recommender-yn86-ly59a8fui.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

let spotifyToken = null;

// Get Spotify access token
async function getSpotifyToken() {
  try {
    console.log('🔑 Getting Spotify token...');
    console.log('Client ID exists:', !!SPOTIFY_CLIENT_ID);
    console.log('Client Secret exists:', !!SPOTIFY_CLIENT_SECRET);
    
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error('Spotify credentials not found in environment variables');
    }
    
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    spotifyToken = response.data.access_token;
    console.log('✅ Spotify token obtained successfully');
    return spotifyToken;
  } catch (error) {
    console.error('❌ Spotify token error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    throw new Error('Failed to get Spotify token: ' + (error.response?.data?.error_description || error.message));
  }
}

// Analyze mood with Gemini
async function analyzeMood(moodText) {
  try {
    console.log('Starting mood analysis for:', moodText);
    
    // Mood mapping using official Spotify genres
    const moodKeywords = {
      happy: { genres: ['pop', 'dance'], energy: 0.8, valence: 0.9, danceability: 0.8 },
      sad: { genres: ['indie', 'blues'], energy: 0.3, valence: 0.2, danceability: 0.3 },
      energetic: { genres: ['electronic', 'rock'], energy: 0.9, valence: 0.7, danceability: 0.8 },
      calm: { genres: ['ambient', 'classical'], energy: 0.2, valence: 0.5, danceability: 0.2 },
      romantic: { genres: ['r-n-b', 'soul'], energy: 0.4, valence: 0.7, danceability: 0.5 },
      excited: { genres: ['pop', 'electronic'], energy: 0.9, valence: 0.8, danceability: 0.9 },
      relaxed: { genres: ['chill', 'jazz'], energy: 0.3, valence: 0.6, danceability: 0.3 }
    };
    
    // Check for keywords in mood text
    const lowerMood = moodText.toLowerCase();
    for (const [keyword, values] of Object.entries(moodKeywords)) {
      if (lowerMood.includes(keyword)) {
        console.log('Found keyword match:', keyword);
        return values;
      }
    }
    
    // Default fallback
    console.log('Using default mood values');
    return {
      genres: ['pop', 'indie'],
      energy: 0.5,
      valence: 0.5,
      danceability: 0.5
    };
  } catch (error) {
    console.error('Error in analyzeMood:', error);
    return {
      genres: ['pop', 'indie'],
      energy: 0.5,
      valence: 0.5,
      danceability: 0.5
    };
  }
}

// Get song recommendations from Spotify using search (more reliable)
async function getRecommendations(moodData) {
  try {
    console.log('Getting recommendations for mood data:', moodData);
    
    if (!spotifyToken) {
      await getSpotifyToken();
    }

    // Create search queries based on mood
    const moodQueries = {
      happy: 'happy upbeat energetic',
      sad: 'sad melancholic emotional',
      energetic: 'energetic pump up workout',
      calm: 'calm peaceful relaxing',
      romantic: 'romantic love ballad'
    };
    
    // Determine search query based on mood
    let searchQuery = 'popular music';
    for (const [mood, query] of Object.entries(moodQueries)) {
      if (moodData.genres.some(genre => genre.includes(mood)) || 
          (mood === 'happy' && moodData.valence > 0.7) ||
          (mood === 'sad' && moodData.valence < 0.4) ||
          (mood === 'energetic' && moodData.energy > 0.7) ||
          (mood === 'calm' && moodData.energy < 0.4)) {
        searchQuery = query;
        break;
      }
    }
    
    // Add genre to search if available
    if (moodData.genres && moodData.genres.length > 0) {
      searchQuery += ` ${moodData.genres[0]}`;
    }
    
    console.log('Using search query:', searchQuery);

    // Use Spotify search endpoint (more reliable than recommendations)
    const params = {
      q: searchQuery,
      type: 'track',
      limit: 20,
      market: 'US'
    };

    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.spotify.com/v1/search?${queryString}`;
    
    console.log('Spotify API request:');
    console.log('URL:', url);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${spotifyToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Spotify response status:', response.status);
    console.log('Tracks received:', response.data?.tracks?.items?.length || 0);
    
    if (!response.data?.tracks?.items) {
      throw new Error('No tracks returned from Spotify API');
    }

    const tracks = response.data.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists?.[0]?.name || 'Unknown Artist',
      preview_url: track.preview_url,
      external_url: track.external_urls?.spotify,
      image: track.album?.images?.[0]?.url
    }));
    
    console.log(`Successfully mapped ${tracks.length} tracks`);
    return tracks;
    
  } catch (error) {
    console.error('❌ Spotify API Error Details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Request URL:', error.config?.url);
    
    if (error.response?.status === 401) {
      console.log('🔄 Token expired, refreshing...');
      spotifyToken = null;
      await getSpotifyToken();
      return await getRecommendations(moodData);
    }
    
    throw new Error(`Spotify API error (${error.response?.status}): ${error.response?.data?.error?.message || error.message}`);
  }
}

app.post('/api/recommend', async (req, res) => {
  try {
    console.log('=== NEW REQUEST ===');
    console.log('Received request:', req.body);
    const { mood } = req.body;
    
    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    console.log('Step 1: Analyzing mood:', mood);
    const moodData = await analyzeMood(mood);
    console.log('Step 1 SUCCESS - Mood analysis result:', moodData);
    
    console.log('Step 2: Getting recommendations...');
    const recommendations = await getRecommendations(moodData);
    console.log('Step 2 SUCCESS - Found', recommendations.length, 'recommendations');
    
    console.log('Step 3: Sending response...');
    res.json({
      mood: moodData,
      recommendations
    });
    console.log('Step 3 SUCCESS - Response sent');
  } catch (error) {
    console.error('❌ ERROR in recommend endpoint:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to get recommendations', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});