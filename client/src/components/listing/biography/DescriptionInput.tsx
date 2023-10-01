import React, { useState } from 'react';

const DescriptionInput = () => {
  const [description, setDescription] = useState('');

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  return (
    <textarea
      className="w-full px-4 py-2 text-gray-700 text-sm border rounded-lg focus:outline-none focus:shadow-outline resize-none"
      placeholder="Introduce them!"
      value={description}
      onChange={handleDescriptionChange}
      style={{
        height: `${Math.max(80, description.split('\n').length * 20)}px`
      }}
    />
  );
};

export default DescriptionInput;
