import React, { useState } from "react";
import styled from "styled-components";
import { useMutation } from "@tanstack/react-query";
import { getLabels } from "../../APIS/ManageForms/getLabels";
import { saveFormData } from "../../APIS/ManageForms/saveFormData";
import { toast } from "react-toastify";
import { Loader } from "../Auth/LoginForm";

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

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
`;

const LabelInput = styled.input`
  font-size: 16px;
  font-weight: bold;
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  &:focus {
    border-bottom: 1px solid #1976d2;
  }
`;

const InputField = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  outline: none;
  font-size: 16px;
  height: 45px;
  &:focus {
    border-color: #0056b3;
  }
`;

const FormButton = styled.button`
  width: 140px;
  height: 42px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  border: none;
  background-color: #007bff;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;
export const ListLoader = styled.div`
  border: 4px solid #0056b3;
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  display: inline-block;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ManageForm = () => {
  const [labels, setLabels] = useState([]);
  const [formData, setFormData] = useState({});
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingForm, setGeneratingForm] = useState(false);
  const [editableLabelIndex, setEditableLabelIndex] = useState(null);

  const fileUploadMutation = useMutation({
    mutationFn: getLabels,
    onSuccess: (data) => {
      if (data?.response?.data && Array.isArray(data.response.data)) {
        const uniqueLabels = [...new Set(data.response.data)];
        setLabels(uniqueLabels);
        setFormData(uniqueLabels.reduce((acc, label) => ({ ...acc, [label]: "" }), {}));
        setGeneratingForm(false);
        toast.success("Form Generated Successfully!")
      }
    },
    onError: () => {
      toast.error("Only PDF, TXT, DOCX, and ODT formats are accepted!")
      setGeneratingForm(false);
      setLabels([]);
    },
    onMutate: () => {
      setGeneratingForm(true);
    },
  });

  const saveFormMutation = useMutation({
    mutationFn: saveFormData,
    onSuccess: () => {
      toast.success("Your records added successfully!");
      setLoading(false);
    },
    onError: () => {
      toast.error("Failed to save form data.");
      setLoading(false);
    },
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      fileUploadMutation.mutate(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLabelClick = (index) => {
    setEditableLabelIndex(index);
  };

  const handleLabelChange = (e, index) => {
    const newLabels = [...labels];
    newLabels[index] = e.target.value;
    setLabels(newLabels);
    setFormData((prev) => {
      const updatedFormData = { ...prev };
      updatedFormData[e.target.value] = prev[labels[index]] || "";
      delete updatedFormData[labels[index]];
      return updatedFormData;
    });
  };

  const handleBlur = () => {
    setEditableLabelIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!uploadedFile) {
      alert("Please upload a file first.");
      return;
    }
    const formattedData = Object.entries(formData).map(([key, value]) => ({ [key]: value }));
    saveFormMutation.mutate({ data: formattedData });
  };

  const handleAddField = () => {
    const newField = `Field ${labels.length + 1}`;
    setLabels([...labels, newField]);
    setFormData({ ...formData, [newField]: "" });
  };

  return (
    <Container>
      <ContainerTopbar>
        <h1>Generate Form</h1>
        <FileUploadLabel htmlFor="file-upload">
          {fileUploadMutation.isLoading ? "Uploading..." : "Choose File"}
        </FileUploadLabel>
        <HiddenFileInput id="file-upload" type="file" onChange={handleFileUpload} />
      </ContainerTopbar>

      {generatingForm ? (
        <LoaderContainer>
          <ListLoader />
        </LoaderContainer>
      ) : (
        labels.length > 0 && (
          <FormContainer>
            <Form>
              {labels.map((label, index) => (
                <FormField key={index}>
                  {editableLabelIndex === index ? (
                    <LabelInput
                      type="text"
                      value={label}
                      onChange={(e) => handleLabelChange(e, index)}
                      onBlur={handleBlur}
                      autoFocus
                    />
                  ) : (
                    <Label onClick={() => handleLabelClick(index)}>{label}</Label>
                  )}
                  <InputField
                    type="text"
                    name={label}
                    value={formData[label] || ""}
                    onChange={handleInputChange}
                  />
                </FormField>
              ))}
            </Form>
            <ButtonGroup>
              <FormButton onClick={handleAddField}>Add Field</FormButton>
              <FormButton onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader /> : "Submit"}
              </FormButton>
            </ButtonGroup>
          </FormContainer>
        )
      )}
    </Container>
  );
};

export default ManageForm;
