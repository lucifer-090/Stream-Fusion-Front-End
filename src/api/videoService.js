import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Ensure this is the correct backend URL

export const fetchVideos = async () => {
  try {
    console.log("Fetching videos..."); // Debugging log
    const response = await axios.get(`${API_BASE_URL}/videos/videoList`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: false, // Change to true if using authentication
    });

    console.log("Videos fetched successfully:", response.data); // Log response data
    return response.data;
  } catch (error) {
    console.error("Axios error fetching videos:", error.response || error.message);
    return [];
  }
};
