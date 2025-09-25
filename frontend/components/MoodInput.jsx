import { useState } from 'react';

function MoodInput({ onSubmit, loading }) {
  const [mood, setMood] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mood.trim()) {
      onSubmit(mood.trim());
    }
  };

  const moodSuggestions = [
    'Happy and energetic',
    'Sad and melancholic',
    'Relaxed and chill',
    'Anxious and stressed',
    'Romantic and dreamy',
    'Angry and frustrated',
    'Nostalgic and reflective',
    'Excited and pumped up'
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mood" className="block text-white text-lg font-medium mb-2">
            How are you feeling right now?
          </label>
          <textarea
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Describe your current mood, emotions, or what kind of music you're in the mood for..."
            className="w-full p-4 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none resize-none"
            rows="3"
            disabled={loading}
          />
        </div>
        
        <div>
          <p className="text-white/80 text-sm mb-2">Quick suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {moodSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setMood(suggestion)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full transition-colors"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || !mood.trim()}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
        >
          {loading ? 'Finding perfect songs...' : 'Get Song Recommendations'}
        </button>
      </form>
    </div>
  );
}

export default MoodInput;