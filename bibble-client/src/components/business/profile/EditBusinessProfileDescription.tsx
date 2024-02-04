import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { updateBusiness } from '../../../features/business/businessSlice';
import { store } from '../../../store';
import { BusinessProfileComponentProps } from './BusinessProfileSection';

const EditBusinessProfileDescription: React.FC<
  BusinessProfileComponentProps
> = ({ setIsEditing }) => {
  const [description, setDescription] = useState('');

  const onChangeDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const onSubmit = useCallback(() => {
    const updates = {
      description
    };

    store
      .dispatch(updateBusiness(updates))
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        toast.error('Failed to update contact information');
      });
  }, [store, description]);

  return (
    <>
      <div className="flex flex-row gap-8 justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-800">Description</h2>
        <button
          onClick={onSubmit}
          className="border rounded-lg px-4 py-1 transition text-gray-400 hover:text-gray-500 hover:border-gray-400"
        >
          <label className="text-sm cursor-pointer">Done</label>
        </button>
      </div>
      <textarea
        className={`text-sm w-full p-2 text-gray-700 border whitespace-pre rounded-lg focus:outline-none focus:shadow-outline`}
        placeholder="Tell us about your business."
        value={description}
        onChange={onChangeDescription}
        rows={10}
      />
    </>
  );
};

export default EditBusinessProfileDescription;
