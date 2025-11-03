import axios from 'axios';

const API_URL = 'http://localhost:3000/api/schemes';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getSchemeRecommendations = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/recommendations`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recommendations');
  }
};

export const getSchemeDetails = async (schemeName, token) => {
  try {
    const response = await axios.post(`${API_URL}/details`, { schemeName }, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch scheme details');
  }
};
