import { PencilIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentBusiness } from '../../../features/business/businessSlice';
import { BusinessProfileComponentProps } from './BusinessProfileSection';

const BusinessProfileMedia: React.FC<BusinessProfileComponentProps> = ({
  setIsEditing
}) => {
  const currentBusiness = useSelector(selectCurrentBusiness);

  return (
    <>
      <div className="flex flex-row gap-8 justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-800">Media</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-full text-gray-400 transition hover:scale-105 hover:text-gray-500"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentBusiness?.media.map((medium, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] cursor-pointer transition hover:scale-105"
          >
            <img
              className="object-cover object-center h-full w-full rounded-lg"
              src={medium.url}
              onClick={() => window.open(medium.url, '_blank')}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default BusinessProfileMedia;
