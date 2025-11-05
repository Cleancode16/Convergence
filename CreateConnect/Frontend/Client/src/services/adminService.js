import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/admin';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getArtisanStats = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/artisans/stats`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
  }
};

export const getAllArtisans = async (token, status = 'all', search = '') => {
  try {
    const response = await axios.get(
      `${API_URL}/artisans?status=${status}&search=${search}`,
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch artisans');
  }
};

export const getArtisanById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/artisans/${id}`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch artisan details');
  }
};

export const verifyArtisan = async (id, notes, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/artisans/${id}/verify`,
      { notes },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify artisan');
  }
};

export const markAsFraud = async (id, notes, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/artisans/${id}/fraud`,
      { notes },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark as fraud');
  }
};

export const rejectArtisan = async (id, notes, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/artisans/${id}/reject`,
      { notes },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reject artisan');
  }
};
