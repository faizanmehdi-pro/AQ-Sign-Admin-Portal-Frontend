import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createCustomer = async (customerData) => {
  try {
    const token = localStorage.getItem('authToken'); // Get token from storage

    const response = await axios.post(`${API_BASE_URL}/Customers`, customerData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.response?.message || 'Failed to create customer');
  }
};
