import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/authSlice';

const ProfileAbout = () => {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-800">
        About {currentUser?.buyerProfile?.firstName}
      </h1>
      <div>
        <button
          onClick={() => alert('Open editor')}
          className="border border-gray-600 transition hover:bg-gray-200 rounded-full py-2 px-4 text-sm"
        >
          Edit profile
        </button>
      </div>
    </div>
  );
};

export default ProfileAbout;
