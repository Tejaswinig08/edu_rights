
import { useState } from "react";

const VideoPlayer = ({ videos = [] }) => {
  const [activeVideo, setActiveVideo] = useState(0);

  if (!videos || videos.length === 0) return null;

  // Extract YouTube video ID from supported URL formats.
  const getYouTubeId = (url) => {
    if (!url || typeof url !== "string") return null;

    const trimmed = url.trim();

    // Accept a raw 11-character YouTube video ID.
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    // Parse full URLs safely.
    try {
      const parsedUrl = new URL(
        trimmed.startsWith("http") ? trimmed : `https://${trimmed}`
      );

      const hostname = parsedUrl.hostname.toLowerCase();
      let videoId = null;

      if (hostname === "youtu.be" || hostname === "www.youtu.be") {
        videoId = parsedUrl.pathname.split("/").filter(Boolean)[0];
      } else if (
        hostname === "youtube.com" ||
        hostname.endsWith(".youtube.com")
      ) {
        const parts = parsedUrl.pathname.split("/").filter(Boolean);

        if (parsedUrl.pathname === "/watch") {
          videoId = parsedUrl.searchParams.get("v");
        } else if (
          ["embed", "v", "shorts", "live"].includes(parts[0])
        ) {
          videoId = parts[1];
        }
      }

      return videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)
        ? videoId
        : null;
    } catch {
      return null;
    }
  };

  const currentVideo = videos[activeVideo];
  const videoId =
    currentVideo?.videoId ||
    (currentVideo?.url ? getYouTubeId(currentVideo.url) : null);

  if (!videoId) return null;

  return (
    <div className="video-player-section">
      <h3 className="video-section-title">Watch &amp; Learn</h3>

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
              type="button"
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
