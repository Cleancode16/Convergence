import axios from 'axios';

const API_URL = 'http://localhost:3000/api/messages';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getMessages = async (connectionId, token) => {
  try {
    const response = await axios.get(`${API_URL}/${connectionId}`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch messages');
  }
};

export const sendMessage = async (connectionId, content, token) => {
  try {
    const response = await axios.post(
      API_URL,
      { connectionId, content },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send message');
  }
};

export const editMessage = async (messageId, content, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${messageId}`,
      { content },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to edit message');
  }
};

export const deleteMessage = async (messageId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${messageId}`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete message');
  }
};
