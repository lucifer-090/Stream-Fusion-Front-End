import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from '../UsedImages/logo1.png';
import uploadIcon from '../UsedImages/upload1.png';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
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
          />
          
          <button className="search-icon">🔍
            {/* <i className="fas fa-search"></i> */}
          </button>
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
