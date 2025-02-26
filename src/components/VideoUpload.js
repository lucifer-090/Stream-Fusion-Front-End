import React, { useState } from 'react';
import { uploadVideo } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/VideoUpload.css';

const VideoUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });
  const [videoFile, setVideoFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please select a video file!");
      return;
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('category', formData.category);
    form.append('tags', formData.tags);
    form.append('video', videoFile);

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        alert('You must be logged in to upload a video!');
        return;
      }

      // Send the video with the token for validation
      await uploadVideo(form, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token for backend validation
          
        },
      });
      alert('Video uploaded successfully!');
      setFormData({ 
        title: '', 
        description: '', 
        category: '', 
        tags: '' }); // Reset form
      setVideoFile(null);

      // Navigate to VideoList page
      navigate("/");

    } catch (error) {
      alert('Failed to upload video. Please try again.');
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <input type="text" name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} />
        <input type="file" accept="video/*" onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default VideoUpload;
