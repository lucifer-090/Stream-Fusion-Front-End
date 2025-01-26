import React, { useState, useEffect } from 'react';
import VideoItem from './VideoItem'; // Assuming this component renders individual video items

const VideoList = () => {
  const [videos, setVideos] = useState([]); // Initialize videos as an empty array

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/uploads'); // Replace with your API endpoint
        const data = await response.json();
        setVideos(data); // Ensure data is an array
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      {Array.isArray(videos) && videos.length > 0 ? (
        videos.map((video) => (
          <VideoItem key={video.id} video={video} />
        ))
      ) : (
        <p>No videos uploaded yet. Check back later or upload your own!</p>
      )}
    </div>
  );
};

export default VideoList;
