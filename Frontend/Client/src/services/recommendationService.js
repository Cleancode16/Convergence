import axios from 'axios';

const API_URL = 'http://localhost:3000/api/recommendations';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getRecommendations = async (token) => {
  try {
    const response = await axios.get(API_URL, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recommendations');
  }
};

export const trackProductView = async (productId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/track-view`,
      { productId },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error('Failed to track view:', error);
  }
};
