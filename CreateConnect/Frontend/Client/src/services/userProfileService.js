import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/user';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateUserProfile = async (profileData, token) => {
  try {
    const response = await axios.put(`${API_URL}/profile`, profileData, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const getProfileStatus = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile/status`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile status');
  }
};
