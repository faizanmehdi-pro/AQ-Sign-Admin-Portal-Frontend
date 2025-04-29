import React from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../Auth/AuthContext';
import { loginUser } from '../../APIS/Auth/login';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1976d2, #2575fc);
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  padding: 32px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  opacity: 0;
  transform: translateY(-50px);
  animation: fadeIn 0.5s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
  color: #1976d2;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  font-size: 16px;
  transition: border-color 0.2s;
  color: #1976d2;

  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const ErrorText = styled.div`
  font-size: 14px;
  color: #e74c3c;
  text-align: left;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #1976d2, #2575fc);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background: linear-gradient(135deg, #2575fc, #1976d2);
  }

  &:disabled {
    background: #b0c4de;
    cursor: not-allowed;
  }
`;

export const Loader = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
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

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success('Login successful!');
      login(data.response.access_token);
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed. Please try again.');
    },
  });

  return (
    <Container>
      <Card>
        <Title>Documents Signing</Title>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values, { setSubmitting }) => {
            mutation.mutate(values, {
              onSettled: () => {
                setSubmitting(false);
              },
            });
          }}
        >
          {({ isSubmitting }) => (
            <StyledForm>
              <div>
                <Input type="email" name="email" placeholder="Email" />
                <ErrorMessage name="email" component={ErrorText} />
              </div>
              <div>
                <Input type="password" name="password" placeholder="Password" />
                <ErrorMessage name="password" component={ErrorText} />
              </div>
              {mutation.isError && <ErrorText>{mutation.error.message}</ErrorText>}
              <Button type="submit" disabled={mutation.isLoading || isSubmitting}>
                {(mutation.isLoading || isSubmitting) ? <Loader /> : 'Login'}
              </Button>
            </StyledForm>
          )}
        </Formik>
      </Card>
    </Container>
  );
};

export default LoginForm;
