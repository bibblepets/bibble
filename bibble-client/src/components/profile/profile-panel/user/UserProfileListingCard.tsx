import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Listing } from '../../../../features/listing/types';
import { toTitleCase } from '../../../../utils/string';
import placeholderPup from '/images/placeholder-pup.png';

interface UserProfileListingCardProps {
  listing: Listing;
}

const UserProfileListingCard: React.FC<UserProfileListingCardProps> = ({
  listing
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/details/${listing._id}`)}
      className="flex flex-row p-4 border rounded-xl gap-8 items-center cursor-pointer"
    >
      <div className="flex flex-row gap-2 cursor-pointer">
        <img
          className="rounded-lg w-[96px] h-[96px] object-cover"
          src={listing.media[0] ? listing.media[0].url : placeholderPup}
        />
      </div>
      <div className="flex flex-col gap-2 cursor-pointer">
        <label className="text-gray-800 cursor-pointer">
          {listing.breeds?.map((breed) => toTitleCase(breed.name)).join(', ')}{' '}
          <span className="font-light text-gray-500 cursor-pointer">
            {toTitleCase(listing.species?.name)}
          </span>
        </label>
        <label className="font-light text-gray-500 cursor-pointer">
          {toTitleCase(listing.gender)}
        </label>
        <label className="font-light text-gray-500 cursor-pointer">
          {toTitleCase(listing.origin?.name)}
        </label>
      </div>
    </div>
  );
};

export default UserProfileListingCard;
