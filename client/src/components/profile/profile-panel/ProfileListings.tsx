import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../features/authSlice';
import { selectMyListings } from '../../../features/listingSlice';
import ProfileListingCard from './ProfileListingCard';
import { useNavigate } from 'react-router-dom';

const ProfileListings = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const myListings = useSelector(selectMyListings);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-semibold text-gray-800">
        Listings posted by {currentUser?.businessProfile?.businessName}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {myListings.slice(0, 4).map((listing, index) => (
          <ProfileListingCard key={index} listing={listing} />
        ))}
      </div>
      <div>
        <button
          onClick={() => navigate('/listing')}
          className="border border-gray-600 transition hover:bg-gray-200 rounded-lg py-2 px-4 font-semibold text-sm"
        >
          Show all {myListings.length} listings
        </button>
      </div>
    </div>
  );
};

export default ProfileListings;
