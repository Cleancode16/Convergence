import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/artist-posts';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const createOrUpdatePost = async (postData, token) => {
  try {
    const response = await axios.post(API_URL, postData, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save post');
  }
};

export const getAllPosts = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch posts');
  }
};

export const getPost = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch post');
  }
};

export const getMyPost = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/my-post`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch your post');
  }
};

export const deletePost = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete post');
  }
};

export const toggleLike = async (id, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/like`, {}, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle like');
  }
};

export const toggleFavorite = async (artistId, token) => {
  try {
    const response = await axios.put(`${API_URL}/${artistId}/favorite`, {}, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to toggle favorite');
  }
};

export const getFavoriteArtists = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/favorites/my-favorites`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch favorites');
  }
};
