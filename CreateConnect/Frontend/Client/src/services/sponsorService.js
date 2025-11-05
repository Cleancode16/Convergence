import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getAllSponsors = async () => {
  try {
    const response = await axios.get(`${API_URL}/sponsors/sponsors`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sponsors');
  }
};

export const getSponsorApproach = async (sponsorData, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/ai-guidance/sponsor-approach`,
      sponsorData,
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get AI guidance');
  }
};
