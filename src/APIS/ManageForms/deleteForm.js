import axios from 'axios';

const API_BASE_URL = "http://98.81.159.86";

export const deleteForm = async (id) => {
  console.log("object", id)
  try {
    const token = localStorage.getItem('authToken'); // Retrieve auth token

    const response = await axios.delete(`${API_BASE_URL}/Forms/${id}/`, {
      headers: {
        // Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);

    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.response?.message || 
      'Failed to delete customer'
    );
  }
};
