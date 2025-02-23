

import React, { useEffect, useState } from "react"; // Add useEffect and useState
import { useLocation, useParams } from "react-router-dom";
import "../styles/VideoPlayer.css";

const VideoPlayer = () => {
  const location = useLocation();
  const { id } = useParams();

  // If video data is passed via navigation
  // const video = location.state?.video;
  const [video, setVideo] = useState(location.state?.video || null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");


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
  );
};

export default VideoPlayer;
