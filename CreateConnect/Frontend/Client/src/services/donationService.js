import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/donations';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getAllNGOs = async () => {
  try {
    const response = await axios.get(`${API_URL}/ngos`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch NGOs');
  }
};

export const getNGODetails = async (id) => {
  try {
    console.log('Fetching NGO details for ID:', id); // Debug log
    const response = await axios.get(`${API_URL}/ngos/${id}`);
    console.log('NGO Details response:', response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message); // Debug log
    throw new Error(error.response?.data?.message || 'Failed to fetch NGO details');
  }
};

export const createDonation = async (donationData, token) => {
  try {
    const response = await axios.post(API_URL, donationData, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create donation');
  }
};

export const getNGODonations = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/ngo`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch donations');
  }
};

export const getMyDonations = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/my`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch donations');
  }
};
