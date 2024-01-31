import { useState } from 'react';

const EditBusinessProfileDescription = () => {
  const [editDescription, setEditDescription] = useState('');

  const onChangeDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditDescription(event.target.value);
  };

  return (
    <textarea
      className={`text-sm w-full p-2 text-gray-700 border whitespace-pre rounded-lg focus:outline-none focus:shadow-outline`}
      placeholder="Tell us about yourself."
      value={editDescription}
      onChange={onChangeDescription}
      rows={10}
    />
  );
};

export default EditBusinessProfileDescription;
