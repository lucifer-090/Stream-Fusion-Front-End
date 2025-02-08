export const loginUser = async (credentials) => {
  const response = await fetch('http://localhost:8080/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Login failed: ${errorDetails}`);
  }

  return await response.json(); // Ensure the response includes user details
};

export const registerUser = async (userData) => {
  const response = await fetch('http://localhost:8080/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Registration failed: ${errorDetails}`);
  }

  return await response.json();
};

export const uploadVideo = async (formData) => {
  const response = await fetch('http://localhost:8080/videos/upload', {
    method: 'POST',
    body: formData, // FormData automatically sets headers
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Failed to upload video: ${errorDetails}`);
  }

  return await response.json();
};
