import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/ngo/reports';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const generateReport = async (period, token) => {
  try {
    console.log('Generating report for period:', period);
    const response = await axios.post(
      `${API_URL}/generate`,
      { period },
      getAuthHeader(token)
    );
    console.log('Report generated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Report generation error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to generate report. Please try again.');
  }
};

export const getReportSummary = async (token) => {
  try {
    const response = await axios.get(
      `${API_URL}/summary`,
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error('Summary fetch error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch summary');
  }
};
