import { useState } from 'react';
import MoodInput from './components/MoodInput';
import SongList from './components/SongList';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [moodData, setMoodData] = useState(null);

  const handleMoodSubmit = async (mood) => {
    setLoading(true);
    try {
      console.log('Submitting mood:', mood);
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://ai-mood-based-song-recommender-2.onrender.com/api/recommend'
        : 'http://localhost:3001/api/recommend';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setRecommendations(data.recommendations || []);
      setMoodData(data.mood);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          AI Mood Music Recommender
        </h1>
        
        <MoodInput onSubmit={handleMoodSubmit} loading={loading} />
        
        {moodData && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Mood Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <div>
                <span className="text-sm opacity-75">Genres:</span>
                <p className="font-medium">{moodData.genres.join(', ')}</p>
              </div>
              <div>
                <span className="text-sm opacity-75">Energy:</span>
                <p className="font-medium">{Math.round(moodData.energy * 100)}%</p>
              </div>
              <div>
                <span className="text-sm opacity-75">Happiness:</span>
                <p className="font-medium">{Math.round(moodData.valence * 100)}%</p>
              </div>
              <div>
                <span className="text-sm opacity-75">Danceability:</span>
                <p className="font-medium">{Math.round(moodData.danceability * 100)}%</p>
              </div>
            </div>
          </div>
        )}
        
        <SongList songs={recommendations} loading={loading} />
      </div>
    </div>
  );
}

export default App;