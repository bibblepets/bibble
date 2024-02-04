import { PencilIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentBusiness } from '../../../features/business/businessSlice';
import { BusinessProfileComponentProps } from './BusinessProfileSection';

const BusinessProfileDescription: React.FC<BusinessProfileComponentProps> = ({
  setIsEditing
}) => {
  const currentBusiness = useSelector(selectCurrentBusiness);

  return (
    <>
      <div className="flex flex-row gap-8 justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-800">Description</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-full text-gray-400 transition hover:scale-105 hover:text-gray-500"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="whitespace-pre-line">{currentBusiness?.description}</p>
    </>
  );
};
export default BusinessProfileDescription;
