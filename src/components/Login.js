import React, { useState } from 'react';
import { loginUser } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = ({setUser}) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData); // Call loginUser API
      localStorage.setItem('token', response.token); // Save token for authentication
      localStorage.setItem('user', JSON.stringify(response.user)); // Save user details in localStorage
      alert(`Welcome back, ${response.user.fullname}!`); // Greet the user
      navigate('/'); // Redirect to home page
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required />

        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange} 
          required />
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
