import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCamera } from 'react-icons/fa';

const FormContainer = styled.form`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CombinedFields = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  outline: none;
  font-size: 16px;
  height: 45px;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #0056b3;
  }
`;

const ProfilePhotoGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ProfilePhotoContainer = styled.div`
  width: 150px;
  height: 150px;
  border: 1px solid #1976d2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfilePhotoPreview = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  cursor: pointer;
`;

const UploadIcon = styled.div`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 50%;
  padding: 10px;
  width: 60px;
  height: 60px;
  border: 2px solid #ddd;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ProfileButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 20px;
`;

const SaveButton = styled.button`
  background-color: #1976d2;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 150px;

  &:hover {
    background-color: #386aa3;
    transform: scale(1.05);
  }
`;

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    lawNumber: '',
    year: '',
    date: '',
    name: '',
    profilePhoto: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
      });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleFileClick = () => {
    document.getElementById('file-input').click();
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <ProfilePhotoGroup>
        <Label>Profile Photo</Label>
        <ProfilePhotoContainer>
          <input
            type="file"
            id="file-input"
            name="profilePhoto"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleInputChange}
          />
          {previewImage ? (
            <ProfilePhotoPreview
              src={previewImage}
              alt="Profile Preview"
              onClick={handleFileClick}
            />
          ) : (
            <UploadIcon onClick={handleFileClick}>
              <FaCamera size={40} />
            </UploadIcon>
          )}
        </ProfilePhotoContainer>
      </ProfilePhotoGroup>

      <CombinedFields>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="lawNumber"
            placeholder="Enter Name"
            value={formData.lawNumber}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="text"
            name="year"
            placeholder="Enter Email"
            value={formData.year}
            onChange={handleInputChange}
          />
        </FormGroup>
      </CombinedFields>

      <CombinedFields>
        <FormGroup>
          <Label>Date of birth</Label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Phone Number</Label>
          <Input
            type="text"
            name="name"
            placeholder="Enter Phone Number"
            value={formData.name}
            onChange={handleInputChange}
          />
        </FormGroup>
      </CombinedFields>

      <ProfileButtonGroup>
        <SaveButton type="submit">Save</SaveButton>
      </ProfileButtonGroup>
    </FormContainer>
  );
};

export default ProfileForm;
