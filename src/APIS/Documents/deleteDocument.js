import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const deleteDocument = async (id) => {
  console.log("object", id)
  try {
    const token = localStorage.getItem('authToken'); // Retrieve auth token

    const response = await axios.delete(`${API_BASE_URL}/DeleteDocuments/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '', // Only add Authorization if token exists
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
