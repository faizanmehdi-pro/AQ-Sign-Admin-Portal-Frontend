import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getDocumentImages = async ({docID}) => {
  try {
    const token = localStorage.getItem('authToken'); // Get token from storage
    const response = await axios.get(`${API_BASE_URL}/GETdocument/${docID}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers
        'Content-Type': 'application/json',
      },
    });

    return response.data.images; // Correctly return images array
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch images');
  }
};
