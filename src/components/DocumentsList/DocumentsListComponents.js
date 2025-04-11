import React, { useState } from "react";
import styled from "styled-components";
import PDFViewer from "./PDFViewer";
import DocumentsListTable from "./DocumentsListTable";

const DocumentsListComponent = () => {
  const [fileView, setFileView] = useState(false);
    const [selectedDocumentID, setSelectedDocumentID] = useState(null);
    const [selectedCustomerID, setSelectedCustomerID] = useState(null);
    const [selectedSignatureImg, setSelectedSignatureImg] = useState(null);

  return (
    <>
      {fileView ? (
        <PDFViewer 
        setFileView={setFileView} 
        selectedDocumentID={selectedDocumentID}
        selectedCustomerID={selectedCustomerID} 
        selectedSignatureImg={selectedSignatureImg}
        />
      ) : (
        <DocumentsListComponentContainer>
          <CustomerTopbar>
            <h1>Documents List</h1>
          </CustomerTopbar>
          <DocumentsListTable 
          setFileView={setFileView} 
          setSelectedDocumentID={setSelectedDocumentID} 
          setSelectedCustomerID={setSelectedCustomerID}
          setSelectedSignatureImg={setSelectedSignatureImg}
          />
        </DocumentsListComponentContainer>
      )}
    </>
  );
};

export default DocumentsListComponent;

const DocumentsListComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 100vh;
`;

const CustomerTopbar = styled.div`
  display: flex;
  justify-content: space-between;

  h1 {
    color: #1976d2;
  }
`;
