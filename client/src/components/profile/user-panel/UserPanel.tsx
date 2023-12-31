import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/authSlice';
import paw from '../../../../public/images/paw.jpeg';
import { CheckIcon } from '@heroicons/react/24/outline';
import { selectMyListings } from '../../../features/listingSlice';
import { toTimeAgo } from '../../../utils/date';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

const UserPanel = () => {
  const currentUser = useSelector(selectCurrentUser);
  const myListings = useSelector(selectMyListings);
  const { time, unit } = toTimeAgo(currentUser?.createdAt);

  return (
    <section className="w-full lg:w-[440px] p-12">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-row w-[412px] lg:w-full shadow-xl rounded-xl p-4">
          <div className="flex flex-col items-center w-[200px] my-4">
            <div className="relative">
              <img
                className="rounded-full w-28 h-28 border"
                src={currentUser?.buyerProfile?.profilePic || paw}
                alt="profile-pic"
              />
              {currentUser?.businessProfile &&
                currentUser?.businessProfile.bibbleTier !== 'Basic' && (
                  <CheckBadgeIcon className="absolute bottom-0 right-0 w-8 h-8 text-sky-500" />
                )}
            </div>
            <div className="h-[8px]" />
            <label className="text-2xl font-bold text-gray-800">
              {currentUser?.buyerProfile?.firstName}
            </label>
            <label className="text-sm text-gray-800">
              {currentUser?.businessProfile?.bibbleTier}
            </label>
          </div>
          <div className="flex flex-col justify-center flex-grow">
            <div className="flex flex-col">
              <label className="text-xl font-bold text-gray-800">
                {myListings.length}
              </label>
              <label className="text-xxs font-medium text-gray-800">
                Listings
              </label>
            </div>
            <hr className="my-4 mx-2" />
            <label className="text-xl font-bold text-gray-800">{time}</label>
            <label className="text-xxs font-medium text-gray-800">
              {unit} on Bibble
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-[412px] lg:w-full border rounded-xl p-6">
          <label className="text-xl font-semibold text-gray-800 pb-2">
            {currentUser?.buyerProfile?.firstName}'s confirmed information
          </label>
          {true && (
            <div className="flex flex-row gap-3">
              <CheckIcon className="w-6 h-6 text-gray-800" />
              <label className="text-gray-800">Identity</label>
            </div>
          )}
          {true && (
            <div className="flex flex-row gap-3">
              <CheckIcon className="w-6 h-6 text-gray-800" />
              <label className="text-gray-800">Personal phone number</label>
            </div>
          )}
          {true && (
            <div className="flex flex-row gap-3">
              <CheckIcon className="w-6 h-6 text-gray-800" />
              <label className="text-gray-800">Personal email </label>
            </div>
          )}
          {true && (
            <div className="flex flex-row gap-3">
              <CheckIcon className="w-6 h-6 text-gray-800" />
              <label className="text-gray-800">Business phone number</label>
            </div>
          )}
          {true && (
            <div className="flex flex-row gap-3">
              <CheckIcon className="w-6 h-6 text-gray-800" />
              <label className="text-gray-800">Business email</label>
            </div>
          )}
          <p
            onClick={() => alert('TODO: learn more modal')}
            className="text-sm font-semibold underline text-gray-800 pt-2 cursor-pointer"
          >
            Learn about identity verification
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserPanel;
