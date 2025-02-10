import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVideos } from "../api/videoService";
import "../styles/VideoList.css";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleVideoClick = (selectedVideo) => {
    navigate(`/videos/${selectedVideo.id}`, {state: {video: selectedVideo}}); // Navigate to VideoPlayer page
  };

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
            <div
              key={video.id}
              className="video-card"
              onClick={() => handleVideoClick(video)} // Handle video click
            >
              <div className="thumbnail-container">
                <video
                  src={`http://localhost:8080${video.videoPath}`}
                  muted
                  loop
                  className="thumbnail"
                  onMouseOver={(e) => e.target.play()} // Play video on hover
                  onMouseOut={(e) => e.target.pause()} // Pause video on hover out
                  // poster="/path/to/placeholder.jpg"
                />
                <div className="play-button">▶</div> {/* Play button */}
              </div>
              <div className="video-details">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-description">{video.description}</p>
                <p className="uploaded-by">Uploaded by: {video.uploadedBy}</p> {/* Display uploader's name */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default VideoList;




