import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSingleForm } from "../../APIS/ManageForms/getSingleForm";
import { saveFormData } from "../../APIS/ManageForms/saveFormData";
import { toast } from "react-toastify";
import { Loader } from "../Auth/LoginForm";
import { IoMdArrowRoundBack } from "react-icons/io";
import { updateForm } from "../../APIS/ManageForms/updateForm";
import { useQueryClient } from "@tanstack/react-query";


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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const BackButton = styled.button`
    display: flex;
    align-items: center;
    background: none;
    outline: none;
    border: none;
    color: #1976d2;
    font-size: 16px;
    font-weight: bold;
    gap: 5px;
    cursor: pointer;
`;

const UpdateForm = ({ formID, onBack }) => {
  const queryClient = useQueryClient();
  const [labels, setLabels] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [editableLabelIndex, setEditableLabelIndex] = useState(null);

  // Fetching the form using useQuery
  const { isLoading, data, isError } = useQuery({
    queryKey: ["getSingleForm", formID],
    queryFn: () => getSingleForm(formID),
    onError: () => {
      toast.error("Failed to load form data.");
    },
  });

  const toastShownRef = useRef(false);

  useEffect(() => {
    if (data?.response?.data?.indexes && !toastShownRef.current) {
      const indexes = data.response.data.indexes;
      const uniqueLabels = [...new Set(indexes)];
  
      setLabels(uniqueLabels);
      setFormData(
        uniqueLabels.reduce((acc, label) => ({ ...acc, [label]: "" }), {})
      );
      toast.success("Form Loaded Successfully!");
      toastShownRef.current = true;
    }
  }, [data]);
  

  const saveFormMutation = useMutation({
    mutationFn: updateForm,
    onSuccess: () => {
      toast.success("Form updated successfully!");
      setLoading(false);
      queryClient.invalidateQueries(["getSingleForm", formID]);
      onBack()
    },
    onError: () => {
      toast.error("Failed to update form data.");
      setLoading(false);
    },
  });
  

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
  
    const originalIndexes = data?.response?.data?.indexes || [];
  
    const payload = {
      index_to_edit: originalIndexes,
      index: labels,
    };
  
    saveFormMutation.mutate({ formID, payload });
  };

  const handleAddField = () => {
    const newField = `Field ${labels.length + 1}`;
    setLabels([...labels, newField]);
    setFormData({ ...formData, [newField]: "" });
  };

  if (isLoading) {
    return (
      <LoaderContainer>
        <ListLoader />
      </LoaderContainer>
    );
  }

  if (isError) {
    return (
      <Container>
        <p>Error loading form. Please try again.</p>
      </Container>
    );
  }

  return (
    <Container>
      <ContainerTopbar>
        
                              <BackButton onClick={onBack}>
                                  <IoMdArrowRoundBack size={22} color="#1976d2" />
                                  Go Back
                              </BackButton>
      </ContainerTopbar>

      {labels.length > 0 && (
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
                  <Label onClick={() => handleLabelClick(index)}>
                    {label}
                  </Label>
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
            {/* <FormButton onClick={handleAddField}>Add Field</FormButton> */}
            <FormButton onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader /> : "Update"}
            </FormButton>
          </ButtonGroup>
        </FormContainer>
      )}
    </Container>
  );
};

export default UpdateForm;
