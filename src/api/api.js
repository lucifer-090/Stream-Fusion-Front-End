export const loginUser = async (credentials) => {
    const response = await fetch('http://localhost:8080/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    return await response.json();
  };
  
  export const registerUser = async (userData) => {
    const response = await fetch('http://localhost:8080/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      throw new Error('Registration failed');
    }
  
    return await response.json();
  };
  
  export const uploadVideo = async (formData) => {
    const response = await fetch('http://localhost:8080/videos/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload video');
    }
  
    return await response.json();
  };
  