import axios from 'axios';

const API_URL = 'http://localhost:3000/api/workshops';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Create workshop
export const createWorkshop = async (workshopData, token) => {
  try {
    const response = await axios.post(API_URL, workshopData, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create workshop');
  }
};

// Get all workshops
export const getAllWorkshops = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch workshops');
  }
};

// Get workshop by ID
export const getWorkshop = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch workshop');
  }
};

// Enroll in workshop
export const enrollWorkshop = async (id, token) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/enroll`, {}, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to enroll');
  }
};

// Cancel enrollment
export const cancelEnrollment = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}/enroll`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel enrollment');
  }
};

// Get my created workshops
export const getMyWorkshops = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/my/created`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch workshops');
  }
};

// Get enrolled workshops
export const getEnrolledWorkshops = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/my/enrolled`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch workshops');
  }
};

// Get AI recommendations
export const getWorkshopRecommendations = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/recommendations`, {}, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get recommendations');
  }
};

// Update workshop
export const updateWorkshop = async (id, workshopData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, workshopData, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update workshop');
  }
};

// Delete workshop
export const deleteWorkshop = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete workshop');
  }
};
