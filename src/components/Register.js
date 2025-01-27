import React, { useState } from 'react';
import { registerUser } from '../utils/api';
import '../styles/Register.css';
import { Navigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '', contact: '', address: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      alert('Registration successful!');
      setFormData({ username: '', email: '', password: '', contact: '', address: '' });
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h2>Register Yourself</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullname" placeholder="Fullname" value={formData.fullname} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="contact" name="contact" placeholder="Contact" value={formData.contact} onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
