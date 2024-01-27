import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { InputProps } from '../../../modules/business/BusinessRegister';
import Input from './Input';

type PasswordInputProps = InputProps & {
  confirmPassword: string;
  setConfirmPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  confirmPassword,
  setConfirmPassword
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Input label="Password" description="Set and confirm a password">
      <div className="flex flex-row gap-4">
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={value}
          onChange={onChange}
        />
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        <button onClick={toggleShowPassword} className="text-gray-500">
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </Input>
  );
};

export default PasswordInput;
