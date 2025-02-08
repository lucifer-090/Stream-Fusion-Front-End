// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "../styles/VideoPlayer.css";


// const VideoPlayer = () => {
//   const { id } = useParams(); // Get the video ID from the URL
//   const [video, setVideo] = useState(null);

//   useEffect(() => {
//     const fetchVideo = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/api/videos/${id}`);
//         const data = await response.json();
//         setVideo(data);
//       } catch (error) {
//         console.error("Error fetching video:", error);
//       }
//     };

//     fetchVideo();
//   }, [id]);

//   if (!video) {
//     return <p>Loading video...</p>;
//   }

//   return (
//     <div className="video-player-container">
//       <div className="video-player">
//         <video
//           src={`http://localhost:8080${video.videoPath}`}
//           controls
//           autoPlay
//         />
//       </div>
//       <div className="video-details">
//         <h1>{video.title}</h1>
//         <p>{video.description}</p>
//       </div>
//     </div>
//   );
// };

// export default VideoPlayer;


import React, { useEffect, useState } from "react"; // Add useEffect and useState
import { useLocation, useParams } from "react-router-dom";
import "../styles/VideoPlayer.css";

const VideoPlayer = () => {
  const location = useLocation();
  const { id } = useParams();

  // If video data is passed via navigation
  // const video = location.state?.video;
  const [video, setVideo] = useState(location.state?.video || null);


  console.log("Received video data:", video); // Debugging log

  useEffect(() => {
    if (!video) {
      const fetchVideo = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/videos/${id}`);
          const data = await response.json();
          setVideo(data);
        } catch (error) {
          console.error("Error fetching video:", error);
        }
      };
      fetchVideo();
    }
  }, [id, video]);

  if (!video) {
    return <p>Loading video...</p>;
  }

  const videoSrc = `http://localhost:8080${video.videoPath}`;
  console.log("Video source URL:", videoSrc); // Debugging log

  return (
    <div className="video-player-container">
      <div className="video-player">
        <video
          src={videoSrc}
          controls
          autoPlay
          className="video-element"
        />
      </div>
      <div className="video-details">
        <h1>{video.title}</h1>
        <p>{video.description}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
