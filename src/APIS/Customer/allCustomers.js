import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const allCustomers = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Get token from storage

    const response = await axios.get(`${API_BASE_URL}/AllCustomers/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers
        'Content-Type': 'application/json',
      },
    });

    return response.data.response.data;
  } catch (error) {
    throw new Error(error.response?.data?.response?.message || 'Failed to fetch customer');
  }
};
