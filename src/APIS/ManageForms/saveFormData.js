import axios from 'axios';


export const saveFormData = async (data) => {
    console.log("formData", data)
    const formData = new FormData();
    formData.append("data", data);
  
    const response = await axios.post(`http://98.81.159.86/SaveIndexes/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  
    return response.data;
  };