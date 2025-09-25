function SongList({ songs, loading }) {
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <span className="ml-4 text-white text-lg">Analyzing your mood and finding perfect songs...</span>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center">
        <p className="text-white/80 text-lg">
          Share your mood above to get personalized song recommendations!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Recommended Songs</h2>
      <div className="grid gap-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="bg-white/10 rounded-lg p-4 flex items-center space-x-4 hover:bg-white/20 transition-colors"
          >
            {song.image && (
              <img
                src={song.image}
                alt={`${song.name} album cover`}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">{song.name}</h3>
              <p className="text-white/80">{song.artist}</p>
            </div>
            <div className="flex space-x-2">
              {song.preview_url && (
                <audio controls className="w-48">
                  <source src={song.preview_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              <a
                href={song.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Open in Spotify
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SongList;