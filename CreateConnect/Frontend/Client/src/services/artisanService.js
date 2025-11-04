import axios from 'axios';

const API_URL = 'http://localhost:3000/api/artisan';

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

export const getConnectionRequests = async (token, status = 'all') => {
  try {
    const response = await axios.get(
      `${API_URL}/connection-requests?status=${status}`,
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch connection requests');
  }
};

export const acceptConnectionRequest = async (connectionId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/connection-requests/${connectionId}/accept`,
      {},
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to accept connection');
  }
};

export const rejectConnectionRequest = async (connectionId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/connection-requests/${connectionId}/reject`,
      {},
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reject connection');
  }
};

export const getConnectedNgos = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/connections`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch connections');
  }
};
