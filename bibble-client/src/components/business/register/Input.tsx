import React from 'react';

type InputProps = {
  label: string;
  description: string;
  children: React.ReactNode;
};

const Input: React.FC<InputProps> = ({ label, description, children }) => {
  return (
    <div className="flex flex-col w-full gap-6">
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <label className="text-gray-800">{label}</label>
          <p className="text-sm font-light text-gray-500">{description}</p>
        </div>
      </div>

      {children}
    </div>
  );
};

export default Input;
