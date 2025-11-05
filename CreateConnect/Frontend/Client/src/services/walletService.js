import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/wallet';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getBalance = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/balance`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch balance');
  }
};

export const getTransactions = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/transactions`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
  }
};

export const getEarnings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/earnings`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch earnings');
  }
};
