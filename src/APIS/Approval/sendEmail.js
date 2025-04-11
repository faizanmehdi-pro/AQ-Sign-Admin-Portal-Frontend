import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const sendEmail = async (customerData) => {
    console.log("formData", customerData.file)
    const formData = new FormData();
    formData.append("customer_id", customerData.customer.value);
    formData.append("document", customerData.file);
  try {
    const token = localStorage.getItem('authToken'); // Get token from storage

    const response = await axios.post(`${API_BASE_URL}/SendEmail`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.response?.message || 'Failed to Send Email');
  }
};
