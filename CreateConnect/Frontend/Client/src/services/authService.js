import axios from 'axios';

const API_URL = 'https://convergence-f7s8.onrender.com/api/auth';

export const signup = async (name, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      name,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

export const signin = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, {
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signin failed');
  }
};
