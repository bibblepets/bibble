import { PencilIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { BiGlobe, BiLogoFacebook, BiLogoInstagram } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { selectCurrentBusiness } from '../../../features/business/businessSlice';
import { BusinessProfileComponentProps } from './BusinessProfileSection';

const BusinessProfileContactInfo: React.FC<BusinessProfileComponentProps> = ({
  setIsEditing
}) => {
  const currentBusiness = useSelector(selectCurrentBusiness);

  return (
    <>
      <div className="flex flex-row gap-8 justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-800">
          Contact Information
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-full text-gray-400 transition hover:scale-105 hover:text-gray-500"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-4">
          <label className="flex flex-row gap-8">
            <span className="text-gray-500 w-48">Email</span>
            <span className="text-gray-800">{currentBusiness?.email}</span>
          </label>
          <label className="flex flex-row gap-8">
            <span className="text-gray-500 w-48">Contact number</span>
            <span className="text-gray-800">
              {currentBusiness?.contactNumber}
            </span>
          </label>
          <label className="flex flex-row gap-8">
            <span className="text-gray-500 w-48">Location</span>
            <span className="text-gray-800">
              {currentBusiness?.address.country}
            </span>
          </label>
        </div>
        <div className="flex flex-col gap-4">
          {currentBusiness?.instagramLink && (
            <a
              onClick={() => window.open(currentBusiness.instagramLink)}
              className="text-gray-800 cursor-pointer"
            >
              <BiLogoInstagram className="text-2xl text-gray-800" />
            </a>
          )}
          {currentBusiness?.facebookLink && (
            <a
              onClick={() => window.open(currentBusiness.facebookLink)}
              className="text-gray-800 cursor-pointer"
            >
              <BiLogoFacebook className="text-2xl text-gray-800" />
            </a>
          )}
          {currentBusiness?.websiteLink && (
            <a
              onClick={() => window.open(currentBusiness.websiteLink)}
              className="text-gray-800 cursor-pointer"
            >
              <BiGlobe className="text-2xl text-gray-800" />
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default BusinessProfileContactInfo;
