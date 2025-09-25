// Quick test to check if server starts
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.post('/api/recommend', (req, res) => {
  console.log('Received request:', req.body);
  res.json({
    mood: { genres: ['pop'], energy: 0.5, valence: 0.5, danceability: 0.5 },
    recommendations: [
      {
        id: 'test',
        name: 'Test Song',
        artist: 'Test Artist',
        preview_url: null,
        external_url: 'https://spotify.com',
        image: null
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/api/test`);
});