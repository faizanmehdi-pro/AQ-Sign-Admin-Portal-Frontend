import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getCustomer = async (id) => {
  try {
    const token = localStorage.getItem('authToken'); // Retrieve auth token

    const response = await axios.get(`${API_BASE_URL}/Customers/${id}/`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '', // Only add Authorization if token exists
        'Content-Type': 'application/json',
      },
    });

    return response.data.response.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.response?.message || 
      'Failed to fetch customer'
    );
  }
};
