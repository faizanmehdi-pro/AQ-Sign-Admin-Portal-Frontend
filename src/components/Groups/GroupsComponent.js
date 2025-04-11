import React, { useState } from "react";
import GroupsListTable from "./GroupsListTable";
import styled from "styled-components";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CreateGroup from "./GroupsForms/CreateGroup";

const GroupsComponent = () => {
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleClose = () => {
    setOpenAddModal(false);
  };

  return (
    <>
        <GroupsComponentContainer>
          <CustomerTopbar>
            <h1>Groups List</h1>
            <Button variant="contained" color="primary" 
              style={{ textTransform: "none", fontWeight: "bold" }}
              onClick={() => setOpenAddModal(true)}
            >
              Create Group
            </Button>
          </CustomerTopbar>
          <GroupsListTable />
        </GroupsComponentContainer>
      {/* Create Customer Modal */}
      <Modal open={openAddModal}>
        <CreateGroup handleClose={handleClose}/>
      </Modal>
    </>
  );
};

export default GroupsComponent;

const GroupsComponentContainer = styled.div`
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
