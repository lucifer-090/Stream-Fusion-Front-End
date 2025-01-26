export const loginUser = async (credentials) => {
    const response = await fetch('http://localhost:9999/api/login', {
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
    const response = await fetch('http://localhost:9999/api/users/register', {
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
    const response = await fetch('http://localhost:9999/api/videos/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      throw new Error('Video uploaded successful');
    }
  
    return await response.json();
  };
  