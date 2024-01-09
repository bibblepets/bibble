import { PaperClipIcon, PhotoIcon } from '@heroicons/react/24/outline';
import placeholderPup from '/images/placeholder-pup.png';
import { toExpiresAt } from '../../../utils/date';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Listing } from '../../../features/listing/types';
import { toCamelCase } from '../../../utils/string';

interface ListingRowProps {
  listing: Listing;
}

const ListingRow: React.FC<ListingRowProps> = ({ listing }) => {
  const navigate = useNavigate();
  const { time, unit } = toExpiresAt(listing.createdAt);

  const handleNavigate = useCallback(() => {
    navigate(`/listing/edit/${listing._id}/media`);
  }, [navigate]);

  return (
    <button onClick={handleNavigate} className="flex flex-row gap-4">
      <div className="rounded-lg">
        {listing.media ? (
          <img
            className="rounded-lg w-[52px] h-[52px] object-cover"
            src={listing.media[0] ? listing.media[0].url : placeholderPup}
          />
        ) : (
          <div className="p-4 bg-gray-300 rounded-lg">
            <PhotoIcon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-1 p-1">
        <div className="flex flex-row items-center gap-2">
          <a className="text-sm font-medium">
            {listing.breeds?.map((breed) => toCamelCase(breed.name)).join(', ')}{' '}
            {toCamelCase(listing.species?.name || '')}
          </a>
          <PaperClipIcon className="w-3 h-3" strokeWidth={2} />
        </div>
        <p className="text-sm font-light text-gray-500">
          {toCamelCase(listing.saleType)}, Expires in {time} {unit}
        </p>
      </div>
    </button>
  );
};

export default ListingRow;
