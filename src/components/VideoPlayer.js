

import React, { useEffect, useState } from "react"; // Add useEffect and useState
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "../styles/VideoPlayer.css";

const VideoPlayer = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();


  // If video data is passed via navigation
  // const video = location.state?.video;
  const [video, setVideo] = useState(location.state?.video || null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [remainingVideos, setRemainingVideos] = useState([]);

  // const [relatedVideos, setRelatedVideos] = useState([]); // ✅ Store related videos


  console.log("Received video data:", video); // Debugging log

  useEffect(() => {
      const fetchVideo = async () => {
        try {
          const response = await fetch(`http://localhost:8080/videos/${id}`);
          const data = await response.json();
          setVideo(data);
        } catch (error) {
          console.error("Error fetching video:", error);
        }
      };
      fetchVideo();
  }, [id]);

  // ✅ Fetch comments for the video
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/comments/${id}`);
        const data = await response.json();
        console.log("Fetched comments:", data); // ✅ Debugging log

        // setComments(data);
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  // Fetch related videos
  // useEffect(() => {
  //   const fetchRelatedVideos = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:8080/api/videos/related/${id}`);

  //       if (!response.ok){
  //         throw new Error("Failed to fetch related videos");
  //       }
  //       const data = await response.json();
  //       console.log("Fetched related videos:", data);

  //       setRelatedVideos(Array.isArray(data) ? data : []);
  //     } catch (error) {
  //       console.error("Error fetching related videos:", error);
  //     }
  //   };

  //   fetchRelatedVideos();
  // }, [id]);

  useEffect(() => {
    const fetchRemainingVideos = async () => {
      try {
        const response = await fetch(`http://localhost:8080/videos/remaining/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched remaining videos:", data);

        if (Array.isArray(data)) {
          setRemainingVideos(data); // ✅ Store remaining videos in state
        } else {
          console.error("Error: Data is not an array", data);
        }
      } catch (error) {
        console.error("Error fetching remaining videos:", error);
      }
    };

    fetchRemainingVideos();
  }, [id]);

  // ✅ Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }


    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to comment!");
        return;
      }

      const response = await fetch("http://localhost:8080/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment, videoId: id }),
      });

      if (response.ok) {
        throw new Error("Failed to post comment");
      }
      const newCommentData = await response.json(); // ✅ Fetch only new comment
      
      setComments((prevComments) => [newCommentData, ...prevComments]); // ✅ Append instead of overwrite
      setNewComment(""); // Clear input after posting

    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!video) {
    return <p>Loading video...</p>;
  }

  const videoSrc = `http://localhost:8080${video.videoPath}`;
  console.log("Video source URL:", videoSrc); // Debugging log

  return (
    <div className="video-player-container">
      <div className="main-content">
        <div className="video-player">
          <video
            src={videoSrc}
            controls
            autoPlay
            className="video-element"
          />
        </div>
        <div className="title">
          <h3>{video.title}</h3>
        </div>
        <div className="video-detail">

          <p> - {video.description}</p>
          <p className="uploaded-by">Uploaded by: {video.uploader ? video.uploader.fullname : 'Unknown'}</p> {/* Display uploader's name */}

        </div>
        {/* 🔽 Comment Section */}
        <div className="comment-section">
          <h4>Comments</h4>

          {/* Input for adding a new comment */}
          <div className="comment-input">
            <input
              type="text"
              value={newComment}
              placeholder="Add a comment..."
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>Post</button>
          </div>

          {/* Display comments */}
          <div className="comment-list">
            {Array.isArray(comments) && comments.length === 0 ? (
              <p>No comments yet. Be the first to comment!</p>
            ) : (
              comments?.map((comment) => (
                <div key={comment.id} className="comment">
                  <strong>{comment.user?.fullname || "Anonymous"}:</strong> {comment.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* ✅ Remaining Videos Sidebar */}
      <div className="remaining-videos">
        <h4>More Videos</h4>
        {remainingVideos.length === 0 ? (
          <p>No more videos available</p>
        ) : (
          remainingVideos.map((video, index) => (
            <div
              key={`${video.id}-${index}`}
              className="remaining-video-item"
              onClick={() => navigate(`/videos/${video.id}`, { state: { video } })}
            >
              {/* <img
                src={`http://localhost:8080${video.videoPath}`}
                alt={video.title}
                className="remaining-thumbnail"
              /> */}
              <video
                src={`http://localhost:8080${video.videoPath}`}
                muted
                loop
                className="remaining-thumbnail"
                onMouseOver={(e) => e.target.play()} // ✅ Play video on hover
                onMouseOut={(e) => e.target.pause()} // ✅ Pause video on hover out
              />
              <div className="play-button">
                ▶️
              </div>
              <div className="remaining-video-info">
                <h5>{video.title}</h5>
                {/* <p> - {video.description}</p> */}
                <p className="uploaded-by">Uploaded by: {video.uploader ? video.uploader.fullname : 'Unknown'}</p> {/* Display uploader's name */}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
};

export default VideoPlayer;
