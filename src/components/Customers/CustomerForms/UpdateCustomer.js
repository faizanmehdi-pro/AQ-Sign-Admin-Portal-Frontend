import React, { useState, useEffect } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Select,
  CombinedFields,
  ButtonGroup,
  Button,
  FormContainer,
  FormTopbar,
} from './Forms.styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getCustomer } from '../../../APIS/Customer/getCustomer';
import { updateCustomer } from '../../../APIS/Customer/updateCustomer';
import { Loader } from '../../Auth/LoginForm';

const UpdateCustomer = ({ setOpenEditModal, customerId }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: customerData } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomer(customerId),
    enabled: !!customerId,
  });

  const mutation = useMutation({
    mutationFn: (updatedCustomer) => updateCustomer(customerId, updatedCustomer),
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries(["customer", customerId]);
      setOpenEditModal(false);
      toast.success("Customer Updated Successfully!");
    },
    onError: () => {
      setLoading(false);
      toast.error("Failed to update customer. Please try again.");
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    status: '',
    address: ''
  });

  useEffect(() => {
    if (customerData) {
      setFormData({
        name: customerData.name || '',
        email: customerData.email || '',
        phone_number: customerData.phone_number || '',
        status: customerData.status || '',
        address: customerData.address || ''
      });
    }
  }, [customerData]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormTopbar>
          <h2>Update Customer</h2>
          <IconButton onClick={() => setOpenEditModal(false)}><CloseIcon /></IconButton>
        </FormTopbar>
        <CombinedFields>
          <FormGroup>
            <Label>Customer Name</Label>
            <Input type="text" name="name" value={formData.name} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </FormGroup>
        </CombinedFields>
        <CombinedFields>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>Address</Label>
            <Input type="text" name="address" value={formData.address} onChange={handleInputChange} />
          </FormGroup>
        </CombinedFields>
        <ButtonGroup>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader /> : "Save"}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default UpdateCustomer;
