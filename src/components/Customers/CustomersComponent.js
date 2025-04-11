import React, { useState } from "react";
import CustomersListTable from "./CustomersListTable";
import styled from "styled-components";
import PDFViewer from "./PDFViewer";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CreateCustomer from "./CustomerForms/CreateCustomer";

const CustomersComponent = () => {
  const [fileView, setFileView] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleClose = () => {
    setOpenAddModal(false);
  };

  return (
    <>
      {fileView ? (
        <PDFViewer setFileView={setFileView} />
      ) : (
        <CustomersComponentContainer>
          <CustomerTopbar>
            <h1>Customers List</h1>
            <Button variant="contained" color="primary" 
              style={{ textTransform: "none", fontWeight: "bold" }}
              onClick={() => setOpenAddModal(true)}
            >
              Create Customer
            </Button>
          </CustomerTopbar>
          <CustomersListTable setFileView={setFileView} />
        </CustomersComponentContainer>
      )}

      {/* Create Customer Modal */}
      <Modal open={openAddModal}>
        <CreateCustomer handleClose={handleClose}/>
      </Modal>
    </>
  );
};

export default CustomersComponent;

const CustomersComponentContainer = styled.div`
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
