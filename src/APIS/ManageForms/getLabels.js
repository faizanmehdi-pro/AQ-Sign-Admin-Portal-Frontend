import axios from 'axios';

export const getLabels = async (file) => {
    const formData = new FormData();
    formData.append("document", file);
  
    const response = await axios.post(`http://98.81.159.86/ExtractIndex/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  
    return response.data;
  };