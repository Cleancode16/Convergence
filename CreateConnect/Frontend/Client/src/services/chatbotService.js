import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/chatbot';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const sendMessage = async (message, conversationHistory, token) => {
  try {
    const response = await axios.post(
      API_URL,
      { message, conversationHistory },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};

export const getRecommendations = async (data, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/recommend`,
      data,
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get recommendations');
  }
};
