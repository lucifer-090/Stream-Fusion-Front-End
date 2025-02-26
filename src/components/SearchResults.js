import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/SearchResults.css";


const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query"); // Get search query from URL

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://localhost:8080/videos/search?query=${query}`);
        const data = await response.json();

        if (response.ok) {
          setVideos(data);
        } else {
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const handleVideoClick = (selectedVideo) => {
    navigate(`/videos/${selectedVideo.id}`);
  };

  return (
    <div className="search-list-container">
      <h2>Search Results for "{query}"</h2>
      {loading ? (
        <p className="resultloading">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="result-no-videos">No videos found for "{query}"</p>
      ) : (
        <div className="result-video-grid">
          {videos.map((video) => (
            <div
              key={video.id}
              className="result-video-card"
              onClick={() => handleVideoClick(video)}
            >
              <div className="result-thumbnail-container">
                <video
                  src={`http://localhost:8080${video.videoPath}`}
                  alt={video.title}
                  className="resultthumbnail"
                  
                />
                <div className="Play-button">▶</div>
              </div>
              <div className="search-video-details">
                <h3 className="search-video-title">{video.title}</h3>
                <p className="search-video-description">Category: {video.category}</p>
                <p className="search-video-uploader">Uploaded by: {video.uploader?.fullname || "Unknown"}</p> {/* Added uploader's name */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
