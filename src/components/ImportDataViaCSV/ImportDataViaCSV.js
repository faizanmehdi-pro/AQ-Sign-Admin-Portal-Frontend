import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const ContainerTopbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    color: #1976d2;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileUploadLabel = styled.label`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background-color: #0056b3;
  }
`;

const ImportDataViaCSV = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
  };

  return (
    <Container>
      <ContainerTopbar>
        <h1>Import Data via CSV</h1>
        <FileUploadLabel htmlFor="file-upload">
          Choose CSV
        </FileUploadLabel>
        <HiddenFileInput id="file-upload" type="file" accept=".csv" onChange={handleFileUpload} />
      </ContainerTopbar>
    </Container>
  );
};

export default ImportDataViaCSV;