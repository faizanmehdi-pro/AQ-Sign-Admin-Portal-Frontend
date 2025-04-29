import axios from 'axios';

const API_BASE_URL = "http://98.81.159.86";

export const updateForm = async ({ formID, payload }) => {
  const formData = new FormData();

  // Add keys/values to FormData as per the Postman screenshot
  formData.append("index_to_edit", JSON.stringify(payload.index_to_edit));
  formData.append("index", JSON.stringify(payload.index));
  // formData.append("title_to_edit", JSON.stringify(payload.title_to_edit));
  // formData.append("title", JSON.stringify(payload.title));

  const response = await axios.patch(
    `${API_BASE_URL}/Forms/${formID}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

