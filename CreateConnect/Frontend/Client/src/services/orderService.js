import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/orders';

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const createOrder = async (orderData, token) => {
  try {
    const response = await axios.post(API_URL, orderData, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

export const getMyOrders = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/my-orders`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const getArtisanOrders = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/artisan-orders`, getAuthHeader(token));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch artisan orders');
  }
};

export const updateOrderStatus = async (orderId, status, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${orderId}`,
      { status },
      getAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};
