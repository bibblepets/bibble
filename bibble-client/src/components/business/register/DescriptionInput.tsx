import React from 'react';
import Input from './Input';

type DescriptionInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const DescriptionInput: React.FC<DescriptionInputProps> = ({
  value,
  onChange
}) => {
  return (
    <Input
      label="Description"
      description="A short write up about your business"
    >
      <textarea
        className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
        placeholder="Description"
        value={value}
        onChange={onChange}
        maxLength={5000}
        style={{
          height: `${Math.max(80, value.split('\n').length * 20)}px`
        }}
      />
    </Input>
  );
};

export default DescriptionInput;
