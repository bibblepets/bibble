import React from 'react';
import { InputProps } from '../../../modules/business/BusinessRegister';
import Input from './Input';

const ContactInput: React.FC<InputProps> = ({ value, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const isValidInput = /^[0-9+]*$/.test(inputValue);

    if (isValidInput) {
      onChange(e);
    }
  };

  return (
    <Input label="Contact Number" description="Your corporate contact number">
      <input
        className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
        type="text"
        placeholder="Contact number"
        value={value}
        onChange={handleInputChange}
      />
    </Input>
  );
};

export default ContactInput;
