import { useState } from "react";

const VideoPlayer = ({ videos = [] }) => {
  const [activeVideo, setActiveVideo] = useState(0);

  if (!videos || videos.length === 0) return null;

  // Extract YouTube video ID from various URL formats
  const getYouTubeId = (url) => {
    const patterns = [
      /youtu\.be\/([^?&]+)/,
      /youtube\.com\/embed\/([^?&]+)/,
      /youtube\.com\/watch\?v=([^?&]+)/,
      /youtube\.com\/v\/([^?&]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const currentVideo = videos[activeVideo];
  const videoId = getYouTubeId(currentVideo.url);

  if (!videoId) return null;

  return (
    <div className="video-player-section">
      <h3 className="video-section-title">📹 Watch & Learn</h3>

      <div className="video-embed-wrapper">
        <iframe
          className="video-embed-iframe"
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={currentVideo.title || "Module Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {videos.length > 1 && (
        <div className="video-playlist">
          {videos.map((video, idx) => (
            <button
              key={idx}
              className={`video-playlist-item ${
                idx === activeVideo ? "active" : ""
              }`}
              onClick={() => setActiveVideo(idx)}
            >
              <span className="video-playlist-number">{idx + 1}</span>
              <span className="video-playlist-title">
                {video.title || `Part ${idx + 1}`}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
