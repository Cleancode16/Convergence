import axios from 'axios';

const API_URL = 'http://localhost:3000/api/ngo';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getProfileStatus = async (token) => {
  try {
    const response = await axios.get(
      `${API_URL}/profile/status`,
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile status');
  }
};

export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const createOrUpdateProfile = async (profileData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/profile`,
      profileData,
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const getMatchingArtisans = async (token, artType = 'all', search = '') => {
  try {
    const response = await axios.get(
      `${API_URL}/artisans?artType=${artType}&search=${search}`,
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch artisans');
  }
};

export const getArtisanDetails = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/artisans/${id}`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch artisan details');
  }
};

export const sendConnectionRequest = async (artisanId, message, purpose, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/connections`,
      { artisanId, message, purpose },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send connection request');
  }
};

export const getNgoConnections = async (token, status = 'all') => {
  try {
    const response = await axios.get(
      `${API_URL}/connections?status=${status}`,
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch connections');
  }
};

export const cancelConnectionRequest = async (connectionId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/connections/${connectionId}`,
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel connection');
  }
};
