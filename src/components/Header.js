import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import logo from '../UsedImages/logo1.png';
import uploadIcon from '../UsedImages/upload1.png';
import profileIcon from "../UsedImages/userprofile.png"; // Add a profile icon
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isProfileOpen, setProfileOpen] = useState(false); // State for profile dropdown
  const [user, setUser] = useState(null); // User authentication state

  // Simulate fetching user data from localStorage/sessionStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // Parse stored user data
    }
  }, []);


  // Toggle the profile dropdown menu
  const toggleProfileMenu = () => {
    setProfileOpen(!isProfileOpen);
  };

  // Close dropdown on navigation
  const handleNavigation = (path) => {
    setProfileOpen(false); // Close dropdown
    navigate(path); // Navigate to the desired path
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user details
    localStorage.removeItem('token'); // Remove authentication token
    setUser(null); // Clear user state
    setProfileOpen(false); // Close dropdown
    navigate('/'); // Redirect to home
  };

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
    navigate(`/videos/${video.id}`, { state: { video } }); // Navigate to the selected video page
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
        {/* <Link to="/login">Login</Link>
        <Link to="/register">Register</Link> */}
        {/* {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>} */}
        {/* <Link to="/upload">
          <img
            src={uploadIcon}
            alt='Upload'
            className='upload-icon'
          />
        </Link> */}

        {user && (
          <Link to="/upload">
            <img src={uploadIcon} alt="Upload" className="upload-icon" />
          </Link>
        )}

        {/* Profile Dropdown */}
        <div 
          className="profile-dropdown"
          tabIndex={0} // Make the element focusable
          onBlur={() => setProfileOpen(false)} // Close on blur
          >
          <img
            src={profileIcon}
            alt="Profile"
            className="profile-icon"
            onClick={toggleProfileMenu}
          />
          {isProfileOpen && (
            <div className="profile-menu">
              {user ? (
                <>
                  <p className="profile-welcome">Hello, {user.fullname}</p>
                  <button
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="profile-menu-item" onClick={handleNavigation}>
                    Login
                  </Link>
                  <Link to="/register" className="profile-menu-item" onClick={handleNavigation}>
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
      {/* Pass setUser to login page
      <Login setUser={setUser} /> */}
    </header>
  );
};

export default Header;
