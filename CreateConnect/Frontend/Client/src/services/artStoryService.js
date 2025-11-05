import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/art-stories';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getAllStories = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch stories');
  }
};

export const getStory = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch story');
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

export const deleteStory = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete story');
  }
};

export const createArtStory = async (storyData, token) => {
  try {
    const response = await axios.post(`${API_URL}`, storyData, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create story');
  }
};

export const updateArtStory = async (id, storyData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, storyData, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update story');
  }
};
