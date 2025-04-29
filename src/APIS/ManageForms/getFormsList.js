import axios from 'axios';

const API_BASE_URL = "http://98.81.159.86";

export const getFormsList = async ({pageNumber, RowLimit}) => {
const page = pageNumber ? pageNumber : 1;
const limit = RowLimit ? RowLimit : 10;

  try {
    const token = localStorage.getItem('authToken'); // Get token from storage

    const response = await axios.get(`${API_BASE_URL}/Forms/?page=${page}&limit=${limit}`, {
      headers: {
        // Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.response?.message || 'Failed to fetch customer');
  }
};
