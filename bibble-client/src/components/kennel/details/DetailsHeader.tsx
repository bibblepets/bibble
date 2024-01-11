import { HeartIcon, ShareIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import {
  selectCurrentUser,
  updateUser
} from '../../../features/user/userSlice';
import { store } from '../../../store';
import { Listing } from '../../../features/listing/types';
import { toTitleCase } from '../../../utils/string';

interface DetailsHeaderProps {
  listing: Listing;
}

const DetailsHeader: React.FC<DetailsHeaderProps> = ({ listing }) => {
  // const currentUser = useSelector(selectCurrentUser);

  // const isListingFavourited = () => {
  //   if (!currentUser) return false;
  //   const favourites = currentUser.buyerProfile.favouriteListings;

  //   if (favourites && favourites.length > 0) {
  //     return (
  //       favourites.filter((favourite) => {
  //         return favourite._id === listing._id;
  //       }).length > 0
  //     );
  //   }

  //   return false;
  // };

  // const handleFavourite = async (listing: Listing) => {
  //   if (!currentUser) return;

  //   const favouriteListings = currentUser.buyerProfile.favouriteListings;
  //   if (!favouriteListings) return;

  //   if (isListingFavourited()) {
  //     // Remove from favourites
  //     await store.dispatch(
  //       updateUser({
  //         ...currentUser,
  //         buyerProfile: {
  //           ...currentUser.buyerProfile,
  //           favouriteListings: favouriteListings.filter(
  //             (favourite) => favourite._id !== listing._id
  //           )
  //         }
  //       })
  //     );
  //   } else {
  //     // Add to favourites
  //     await store.dispatch(
  //       updateUser({
  //         ...currentUser,
  //         buyerProfile: {
  //           ...currentUser.buyerProfile,
  //           favouriteListings: [...favouriteListings, listing]
  //         }
  //       })
  //     );
  //   }
  // };

  return (
    <>
      {/* Head Banner */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          {listing.name ? (
            <>
              <h1 className="text-2xl font-semibold text-gray-800">{`Hi, I'm ${toTitleCase(
                listing.name
              )} 👋🏼`}</h1>
              <h2 className="text-xl font-semibold text-gray-600">{`${listing.breeds
                ?.map((breed) => toTitleCase(breed.name))
                .join(', ')} ${toTitleCase(listing.species?.name)}`}</h2>
            </>
          ) : (
            <h1 className="text-2xl font-semibold text-gray-800">{`${listing.breeds
              ?.map((breed) => breed.name)
              .join(', ')} ${toTitleCase(listing.species?.name)}`}</h1>
          )}
        </div>
        <div className="flex items-center place-self-end gap-4">
          <button
            className="flex items-center gap-2 text-neutral-700"
            // onClick={() => handleFavourite(listing)}
          >
            {/* {isListingFavourited() ? (
              <HeartIcon className="w-5 h-5 fill-rose-500" />
            ) : (
              <HeartIcon className="w-5 h-5 fill-neutral-700" />
            )} */}
            <HeartIcon className="w-5 h-5 fill-neutral-700" />
          </button>

          <hr className="w-px h-4 bg-neutral-200" />

          <button className="flex items-center gap-2 text-neutral-700">
            <ShareIcon className="w-5 h-5 text-neutral-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Cover Image */}
        <div className="w-full aspect-square overflow-hidden rounded-2xl relative">
          <img
            src={listing.media[0]?.url}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Grid of 4 Images */}
        <div className="grid grid-cols-2 gap-2">
          {listing.media.slice(1, 5).map((img, i) => {
            return (
              <div
                key={i}
                className="w-full aspect-square overflow-hidden rounded-2xl relative"
              >
                <img src={img.url} className="object-cover w-full h-full" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DetailsHeader;
