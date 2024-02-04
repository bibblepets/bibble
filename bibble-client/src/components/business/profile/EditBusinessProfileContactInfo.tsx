import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  selectCurrentBusiness,
  updateBusiness
} from '../../../features/business/businessSlice';
import { store } from '../../../store';
import { BusinessProfileComponentProps } from './BusinessProfileSection';

const EditBusinessProfileContactInfo: React.FC<
  BusinessProfileComponentProps
> = ({ setIsEditing }) => {
  const currentBusiness = useSelector(selectCurrentBusiness);
  const [email, setEmail] = useState(currentBusiness?.email);
  const [contactNumber, setContactNumber] = useState(
    currentBusiness?.contactNumber
  );
  const [instagramLink, setInstagramLink] = useState(
    currentBusiness?.instagramLink
  );
  const [facebookLink, setFacebookLink] = useState(
    currentBusiness?.facebookLink
  );
  const [websiteLink, setWebsiteLink] = useState(currentBusiness?.websiteLink);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangeContactNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const phoneRegex = /^[0-9\b]+$/;
    if (event.target.value === '' || phoneRegex.test(event.target.value)) {
      setContactNumber(event.target.value);
    }
  };

  const onChangeInstagramLink = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInstagramLink(event.target.value);
  };

  const onChangeFacebookLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFacebookLink(event.target.value);
  };

  const onChangeWebsiteLink = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWebsiteLink(event.target.value);
  };

  const onSubmit = useCallback(() => {
    const updates = {
      email,
      contactNumber,
      instagramLink,
      facebookLink,
      websiteLink
    };

    store
      .dispatch(updateBusiness(updates))
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        toast.error('Failed to update contact information');
      });
  }, [store, email, contactNumber, instagramLink, facebookLink, websiteLink]);

  return (
    <>
      <div className="flex flex-row gap-8 justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-800">
          Contact Information
        </h2>
        <button
          onClick={onSubmit}
          className="border rounded-lg px-4 py-1 transition text-gray-400 hover:text-gray-500 hover:border-gray-400"
        >
          <label className="text-sm cursor-pointer">Done</label>
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-4 w-full">
          <label className="flex flex-row gap-8 items-center">
            <span className="text-gray-500 w-48">Email</span>
            <input
              className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
              type="text"
              placeholder="Business email"
              value={email}
              onChange={onChangeEmail}
            />
          </label>
          <label className="flex flex-row gap-8 items-center">
            <span className="text-gray-500 w-48">Contact Number</span>
            <input
              className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
              type="text"
              placeholder="Contact number"
              value={contactNumber}
              onChange={onChangeContactNumber}
            />
          </label>
          <label className="flex flex-row gap-8 items-center">
            <span className="text-gray-500 w-48">Instagram Link</span>
            <input
              className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
              type="text"
              placeholder="Instagram link"
              value={instagramLink}
              onChange={onChangeInstagramLink}
            />
          </label>
          <label className="flex flex-row gap-8 items-center">
            <span className="text-gray-500 w-48">Facebook Link</span>
            <input
              className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
              type="text"
              placeholder="Facebook link"
              value={facebookLink}
              onChange={onChangeFacebookLink}
            />
          </label>
          <label className="flex flex-row gap-8 items-center">
            <span className="text-gray-500 w-48">Website Link</span>
            <input
              className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
              type="text"
              placeholder="Website link"
              value={websiteLink}
              onChange={onChangeWebsiteLink}
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default EditBusinessProfileContactInfo;
