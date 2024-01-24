import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectMyListings } from '../../../../features/listing/listingSlice';
import { selectCurrentUser } from '../../../../features/user/userSlice';
import UserProfileListingCard from './UserProfileListingCard';

const UserProfileListings = () => {
  const currentUser = useSelector(selectCurrentUser);
  const myListings = useSelector(selectMyListings);
  const [isShowingAll, setIsShowingAll] = useState(false);
  const shownListings = isShowingAll ? myListings : myListings.slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-semibold text-gray-800">
        Listings posted by {currentUser?.firstName}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {shownListings.map((listing, index) => (
          <UserProfileListingCard key={index} listing={listing} />
        ))}
      </div>
      <div>
        <button
          onClick={() => setIsShowingAll(!isShowingAll)}
          className="border border-gray-600 transition hover:bg-gray-200 rounded-lg py-2 px-4 font-semibold text-sm"
        >
          {isShowingAll
            ? 'Show less'
            : `Show all ${myListings.length} listings`}
        </button>
      </div>
    </div>
  );
};

export default UserProfileListings;
