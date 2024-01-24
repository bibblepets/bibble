import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BioEdit from '../edit/BioEdit';
import UserProfileEditSection from './UserProfileEditSection';
import { useProfileEdit } from './hooks';

const UserProfileEdit = () => {
  const navigate = useNavigate();
  const profile = useProfileEdit();
  const [editValue, setEditValue] = useState('');

  return (
    <div className="flex flex-col gap-12 pr-12">
      {/* PERSONAL INFO */}
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-semibold text-gray-800">Personal info</h1>
        {Object.entries(profile).map(([key, value]) => (
          <UserProfileEditSection
            key={key}
            label={value.label}
            value={value.value}
            editValue={editValue}
            setEditValue={setEditValue}
            editDescription={value.editDescription}
            editComponent={value.editComponent}
          />
        ))}
      </div>

      {/* ABOUT YOU */}
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-semibold text-gray-800">About you</h1>
        <BioEdit editValue={editValue} setEditValue={setEditValue} />
      </div>

      {/* BACK BUTTON */}
      <div className="flex flex-row justify-end">
        <button
          disabled={editValue !== ''}
          onClick={() => navigate('/profile')}
          className={`flex flex-row items-center gap-2 ${
            editValue !== '' ? 'bg-gray-500' : 'bg-gray-800 hover:bg-gray-900'
          } rounded-md py-2 px-4 transition`}
        >
          <ArrowLeftIcon
            className={`w-4 h-4 text-white ${
              editValue === '' && 'cursor-pointer'
            }`}
          />
          <label
            className={`text-sm font-semibold text-white ${
              editValue === '' && 'cursor-pointer'
            }`}
          >
            Back
          </label>
        </button>
      </div>
    </div>
  );
};

export default UserProfileEdit;
