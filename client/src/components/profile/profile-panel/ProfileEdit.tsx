import { useState } from 'react';
import ProfileEditSection from './ProfileEditSection';
import { useProfileEdit } from './hooks';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const profile = useProfileEdit();
  const [editValue, setEditValue] = useState('');

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-gray-800">Personal info</h1>

      {Object.entries(profile).map(([key, value]) => (
        <ProfileEditSection
          key={key}
          label={value.label}
          value={value.value}
          editValue={editValue}
          setEditValue={setEditValue}
          editDescription={value.editDescription}
          editComponent={value.editComponent}
        />
      ))}

      <div className="flex flex-row justify-end mt-8">
        <button
          onClick={() => navigate('/profile')}
          className="flex flex-row items-center gap-2 bg-gray-800 rounded-md py-2 px-4 transition hover:bg-gray-900"
        >
          <ArrowLeftIcon className="w-4 h-4 text-white cursor-pointer" />
          <label className="text-sm font-semibold text-white cursor-pointer">
            Back
          </label>
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
