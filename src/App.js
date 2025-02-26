import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import VideoUpload from './components/VideoUpload';
import VideoList from './components/VideoList';
import Header from './components/Header';
import VideoPlayer from "./components/VideoPlayer";
import SearchResults from "./components/SearchResults"; // Import SearchResults Page
import './styles/App.css';



const App = () => {
  return (
    <Router>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<VideoList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/" element={<VideoList />} />
          <Route path="/videos/:id" element={<VideoPlayer />} />
          <Route path="/search" element={<SearchResults />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
