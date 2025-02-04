import React, { useEffect, useState } from "react";
import { fetchVideos } from "../api/videoService";
import "../styles/VideoList.css";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVideos = async () => {
      try {
        console.log("Calling fetchVideos()..."); // Debugging log
        const videoData = await fetchVideos();
        console.log("Received videos:", videoData); // Debugging log
        setVideos(videoData);
      } catch (error) {
        console.error("Error loading videos:", error);
      }finally {
        setLoading(false);
      }
    };

    getVideos();
  }, []);

  return (
    <div className="video-list-container">
      <h2>Uploaded Videos</h2>
      {loading ? (
        <p className="loading">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="no-videos">No videos available. Please upload some videos!</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-card">
              <div className="thumbnail-container">
                <video
                  src={`http://localhost:9999${video.videoPath}`}
                  muted
                  loop
                  className="thumbnail"
                  onMouseOver={(e) => e.target.play()}
                  onMouseOut={(e) => e.target.pause()}
                  poster="/path/to/placeholder.jpg"
                />
                <div className="play-button">▶</div>
              </div>
              <div className="video-details">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-description">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default VideoList;




