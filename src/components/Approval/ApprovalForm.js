import React, { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { useQuery } from "@tanstack/react-query";
import { allCustomers } from '../../APIS/Customer/allCustomers';
import { useMutation, useQueryClient  } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { sendEmail } from '../../APIS/Approval/sendEmail';
import { Loader } from '../Auth/LoginForm';

const Form = styled.form`
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
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
  transition: border-color 0.3s ease;
  height: 45px;

  &:focus {
    border-color: #0056b3;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 180px;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  outline: none;
  font-size: 16px;
  transition: border-color 0.3s ease;
`;

const CombinedFields = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 12px 25px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border-radius: 8px;
  width: 200px;
  align-self: flex-end;

  &:hover {
    transform: scale(1.05);
  }

  ${({ type }) =>
    type === 'submit' &&
    `
    background-color: #1976d2;
    color: white;

    &:hover {
      background-color: #386aa3;
    }
  `}

  ${({ type }) =>
    type === 'button' &&
    `
    background: none;
    color: #1976d2;
    border: 1px solid #1976d2;

    &:hover {
      background-color: #e3f2fd;
    }
  `}
`;
export const ListLoader = styled.div`
  border: 4px solid #0056b3;
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ApprovalForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    customer: null,
    email: '',
    status: null,
    file: null,
    description:
      'Hi [First Name],\n\nI hope you are doing well. Please look at the attached [Document Name] for your review and signature.\nIf you have any questions or encounter any issues, please feel free to ask.\n\nBest regards,\nAQ Support',
  });
  const [loading, setLoading] = useState(false);
  const { data: customers, isLoading, isError } = useQuery({
    queryKey: ["customers"],
    queryFn: allCustomers,
  });

  const customerOptions = isLoading
  ? [{ value: "", label: <ListLoader />, isDisabled: true }]
  : customers
  ? customers.map((customer) => ({
      value: customer.id,
      label: customer.name,
    }))
  : [];

    const mutation = useMutation({
      mutationFn: sendEmail,
      onSuccess: () => {
        setLoading(false);
        queryClient.invalidateQueries(['customers']);
        toast.success('Email sent successfully!');
      },
      onError: (error) => {
        setLoading(false);
        toast.error(error.message);
      },
    });

  const statusOptions = [
    { value: 'signed', label: 'Signed' },
    { value: 'pending', label: 'Pending' },
  ];


  const updateDescription = (customer, file) => {
    const customerName = customer ? customer.label : '[First Name]';
    const fileName = file ? file.name : '[Document Name]';
    return `Hi ${customerName},\n\nI hope you are doing well. Please look at the attached ${fileName} for your review and signature.\nIf you have any questions or encounter any issues, please feel free to ask.\n\nBest regards,\nAQ Support`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (selectedOption, field) => {
    setFormData((prevState) => {
      const updatedData = { ...prevState, [field]: selectedOption };
      return { ...updatedData, description: updateDescription(updatedData.customer, updatedData.file) };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => {
      return { ...prevState, file, description: updateDescription(prevState.customer, file) };
    });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    mutation.mutate(formData);
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      width: '100%',
      borderRadius: '8px',
      border: '1px solid #1976d2',
      fontSize: '16px',
      outline: 'none',
      height: '45px',
      transition: 'border-color 0.3s ease',
      marginTop: '8px'
    }),
    option: (provided) => ({
      ...provided,
      fontSize: '16px',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '16px',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '8px',
      border: '1px solid #1976d2',
    }),
  };

  return (
    <Form onSubmit={handleSubmit}>
      <CombinedFields>
        <FormGroup>
        <Label>Customer Name</Label>
          <Select
            options={customerOptions}
            onChange={(option) => handleSelectChange(option, "customer")}
            placeholder="Select Customer"
            isSearchable
            styles={customSelectStyles}
          />
        </FormGroup>

        <FormGroup>
          <Label>Status</Label>
          <Select
            options={statusOptions}
            onChange={(option) => handleSelectChange(option, 'status')}
            placeholder="Select Status"
            isSearchable={false}
            styles={customSelectStyles}
          />
        </FormGroup>
      </CombinedFields>

        <FormGroup>
          <Label>Choose File</Label>
          <Input type="file" name="file" accept="application/pdf" onChange={handleFileChange} />
        </FormGroup>

      <FormGroup>
        <Label>Email Description</Label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader /> : "Send"}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default ApprovalForm;
