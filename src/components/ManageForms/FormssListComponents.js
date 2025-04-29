import React, { useState } from "react";
import FormsListTable from "./FormsListTable";
import styled from "styled-components";
import Button from "@mui/material/Button";
import CreateForm from "./CreateForm";
import UpdateForm from "./UpdateForm";

const FormsComponent = () => {
  const [activeView, setActiveView] = useState("list"); // 'list' | 'create' | 'update'
  const [formID, setFormID] = useState(null);

  return (
    <>
      {activeView === "list" && (
        <FormsComponentContainer>
          <CustomerTopbar>
            <h1>Forms</h1>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setActiveView("create")}
              style={{ textTransform: "none", fontWeight: "bold" }}
            >
              Create Form
            </Button>
          </CustomerTopbar>
          <FormsListTable setFormID={setFormID} setActiveView={setActiveView}/>
        </FormsComponentContainer>
      )}

      {activeView === "create" && (
        <CreateForm onBack={() => setActiveView("list")} />
      )}

      {activeView === "update" && (
        <UpdateForm formID={formID} onBack={() => setActiveView("list")} />
      )}
    </>
  );
};

export default FormsComponent;

const FormsComponentContainer = styled.div`
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
