import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import logo from '../UsedImages/logo1.png';
import uploadIcon from '../UsedImages/upload1.png';
import profileIcon from "../UsedImages/userprofile.png";
import notificationIcon from '../UsedImages/notificationicon.png';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Load user and notifications on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      
      localStorage.removeItem("notifications"); //  Clear old cached notifications
      fetchNotifications(); // Fetch fresh notifications

    }
  }, []);


  //  Fetch notifications securely
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch("http://localhost:8080/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();

      // Update state with fresh notifications
      setNotifications(data);


    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark only the clicked notification as read
  const markNotificationAsRead = async (notificationId, videoId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`http://localhost:8080/notifications/read/${notificationId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Update state and persist notifications in localStorage
      setNotifications((prevNotifications) => {
        const updatedNotifications = prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        );

        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        return updatedNotifications;
      });

      // Navigate to video player page with the video ID
      if (videoId) {
        navigate(`/videos/${videoId}`);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch("http://localhost:8080/notifications/read", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Mark all as read in state & persist it
      setNotifications((prevNotifications) => {
        const updatedNotifications = prevNotifications.map((n) => ({
          ...n,
          read: true,
        }));

        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
        return updatedNotifications;
      });

    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };


  // Toggle dropdown when clicking notification icon
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileMenu = () => setProfileOpen(!isProfileOpen);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setProfileOpen(false);
    navigate('/');
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-icon">🔍</button>
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((video) => (
                <li
                  key={video.id}
                  onClick={() => navigate(`/videos/${video.id}`)}
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

        {/* 🔔 Notification Icon & Dropdown */}
        {user && (
          <div className="notification-container" ref={dropdownRef}>
            <img
              src={notificationIcon}
              alt="Notifications"
              className="nav-icon notification-icon"
              onClick={toggleDropdown}
            />
            {/* {notifications.some(n => !n.isRead) && <span className="notification-badge">{notifications.filter(n => !n.isRead).length}</span>} */}

            {notifications.some((n) => !n.read) && (
              <span className="notification-badge">
                {notifications.filter((n) => !n.read).length}
              </span>
            )}


            {/* Dropdown */}
            {showDropdown && (
              <div className="notification-dropdown">
                {notifications.length === 0 ? (
                  <p>No new notifications</p>
                ) : (
                  <>
                    <button className="mark-all-btn" onClick={markAllAsRead}>
                      Mark All as Read
                    </button>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.read ? '' : 'new-notification'}`}
                        onClick={() => markNotificationAsRead(notification.id, notification.videoId)}
                      >
                        {notification.message}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {user && (
          <Link to="/upload">
            <img src={uploadIcon} alt="Upload" className="upload-icon" />
          </Link>
        )}

        {/* Profile Dropdown */}
        <div className="profile-dropdown" tabIndex={0} onBlur={() => setProfileOpen(false)}>
          <img src={profileIcon} alt="Profile" className="profile-icon" onClick={toggleProfileMenu} />
          {isProfileOpen && (
            <div className="profile-menu">
              {user ? (
                <>
                  <p className="profile-welcome">Hello, {user.fullname}</p>
                  <button className="logout-button" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="profile-menu-item">Login</Link>
                  <Link to="/register" className="profile-menu-item">Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
