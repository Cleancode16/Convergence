import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/analytics';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getSalesAnalytics = async (period, token) => {
  try {
    const response = await axios.get(`${API_URL}/sales?period=${period}`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
  }
};

export const getProductAnalytics = async (productId, token) => {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product analytics');
  }
};
