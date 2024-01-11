import { useNavigate } from 'react-router-dom';
import paw from '/images/paw.jpeg';
import placeholderPup from '/images/placeholder-pup.png';
import { Listing } from '../../../features/listing/types';
import { toTitleCase } from '../../../utils/string';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center gap-4"
      onClick={() => navigate(`/details/${listing._id}`)}
    >
      <img
        className="aspect-square object-cover rounded-3xl transition hover:scale-105 cursor-pointer"
        src={listing.media[0] ? listing.media[0].url : placeholderPup}
      />
      <div className="flex flex-col items-center gap-2">
        <a className="text-neutral-800 whitespace-nowrap overflow-ellipsis">
          {listing.breeds
            ?.map((listing) => toTitleCase(listing.name))
            .join(', ')}
        </a>
        <a className="text-neutral-500">${listing.price}</a>
        <div className="flex items-center gap-2">
          <img
            className="h-6 w-6 border border-gray-300 rounded-full"
            src={listing.user?.profilePic?.url || paw}
          />
          <a className="text-xs text-neutral-500">
            Posted by {listing.user?.firstName}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
