import React, { useState } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  CombinedFields,
  ButtonGroup,
  Button,
  FormContainer,
  FormTopbar,
} from './Forms.styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQueryClient  } from '@tanstack/react-query';
import { createCustomer } from '../../../APIS/Customer/createCustomer';
import { toast } from 'react-toastify';
import { Loader } from '../../Auth/LoginForm';

const CreateCustomer = ({ handleClose }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    status: '',
    address: '',
  });

  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries(['customers']);
      toast.success('Customer Created successfully!');
      handleClose();
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormTopbar>
          <h2>Create Customer</h2>
          <IconButton edge="end" color="inherit" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </FormTopbar>

        <CombinedFields>
          <FormGroup>
            <Label>Customer Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="Enter Customer Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormGroup>
        </CombinedFields>

        <CombinedFields>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="text"
              name="phone_number"
              placeholder="Enter Phone Number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </FormGroup>
        </CombinedFields>

        <ButtonGroup>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader /> : "Create"}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default CreateCustomer;
