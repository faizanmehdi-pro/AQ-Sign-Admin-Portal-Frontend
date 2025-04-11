import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const updateDocument = async ({ docID, signatures, customer_id }) => {
  try {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();

    // Prepare sign_data
    const signDataArray = signatures.map(({ imageId, pageNumber, position, size }) => ({
      converted_doc_id: imageId, // Assuming `imageId` is equivalent to `converted_doc_id`
      position_x_start: position.x,
      position_y_start: position.y,
      width: size.width,
      height: size.height,
    }));

    formData.append('sign_data', JSON.stringify(signDataArray)); // Convert to JSON string
    formData.append('customer_id', customer_id); 

    // Append signature files
    // signatures.forEach((signature, index) => {
    //   if (signature.image) {
    //     const base64Data = signature.image.split(',')[1]; // Extract base64 part
    //     const byteCharacters = atob(base64Data); // Decode base64
    //     const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
    //     const byteArray = new Uint8Array(byteNumbers);
    //     const blob = new Blob([byteArray], { type: 'image/png' }); // Convert to Blob
    //     const file = new File([blob], `signature_${index}.png`, { type: 'image/png' });

    //     formData.append(`signature[${index}]`, file);
    //   }
    // });

    // Debugging: Log form data
    for (let pair of formData.entries()) {
      console.log("data", pair[0], pair[1]);
    }

    const response = await axios.patch(`${API_BASE_URL}/UpdateDocument/${docID}/`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '', // Only add Authorization if token exists
        'Content-Type': 'multipart/form-data', // Correct content type
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating document:", error);
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.response?.message || 
      'Failed to update document'
    );
  }
};