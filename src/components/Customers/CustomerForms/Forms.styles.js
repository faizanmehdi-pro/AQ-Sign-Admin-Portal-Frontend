import styled from 'styled-components';

export const FormContainer = styled.div`
 position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const FormTopbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
`;

export const Input = styled.input`
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

export const Textarea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  outline: none;
  font-size: 16px;
  transition: border-color 0.3s ease;
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border-radius: 8px;
  border: 1px solid #1976d2;
  outline: none;
  font-size: 16px;
`;

export const RadioGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const RadioField = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
`;

export const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  margin-bottom: 3px;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px 0 0 15px;
`;

export const CheckboxField = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 16px;
`;

export const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  margin-bottom: 7px;
`;

export const CombinedFields = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

export const Button = styled.button`
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

  ${({ type }) => type === 'submit' && `
    background-color: #1976d2;
    color: white;

    &:hover {
      background-color: #386aa3;
    }
  `}

  ${({ type }) => type === 'button' && `
    background: none;
    color: #1976d2;
    border: 1px solid #1976d2;

    &:hover {
      background-color: #e3f2fd;
    }
  `}
`;
