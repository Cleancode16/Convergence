import axios from 'axios';

const API_URL = 'http://localhost:3000/api/comments';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getComments = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch comments');
  }
};

export const addComment = async (productId, content, token) => {
  try {
    const response = await axios.post(
      API_URL,
      { productId, content },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add comment');
  }
};

export const updateComment = async (commentId, content, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${commentId}`,
      { content },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update comment');
  }
};

export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${commentId}`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete comment');
  }
};
