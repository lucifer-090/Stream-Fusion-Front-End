import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import logo from '../UsedImages/logo1.png';
import uploadIcon from '../UsedImages/upload1.png';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch matching video suggestions based on search query
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]); // Clear suggestions if input is empty
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/videos/search?query=${query}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSuggestions(data); // Update suggestions with fetched data
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (video) => {
    navigate(`/videos/${video.id}`, { state: {video}}); // Navigate to the selected video page
    setSearchQuery(""); // Clear the search bar
    setSuggestions([]); // Clear suggestions
  };


  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="StreamFusion Logo" className="logo-image" />
        </Link>
      </div>

      {location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/upload' && (
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search for a Video...."
            className="search-input"
            value={searchQuery}
            onChange={handleSearchChange} // Handle input change
          />
          
          <button className="search-icon">🔍
            {/* <i className="fas fa-search"></i> */}
          </button>
          {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((video) => (
                  <li
                    key={video.id}
                    onClick={() => handleSuggestionClick(video)} // Handle suggestion click
                    className="suggestion-item"
                  >
                    {video.title}
                  </li>
                ))}
              </ul>
            )}
        </div>
      )}
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/upload">
        <img
        src={uploadIcon}
        alt='Upload'
        className='upload-icon'
        />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
