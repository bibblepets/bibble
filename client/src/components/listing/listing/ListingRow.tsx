import { PaperClipIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Listing } from '../../../types';
import { toCountdown } from '../../../utils/date';

interface ListingRowProps {
  listing: Listing;
}

const ListingRow: React.FC<ListingRowProps> = ({ listing }) => {
  console.log(listing.expiryDate);
  return (
    <button onClick={() => alert('implement')} className="flex flex-row gap-4">
      <div className="rounded-lg">
        {listing.media ? (
          <img
            className="rounded-lg w-[52px] h-[52px] object-cover"
            src={
              // listing.media.find((e) => e.file.type.startsWith('image'))?.url
              // TODO TITUS: Revert
              listing.media[0]?.url
            }
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
            {listing.animal.breeds.map((breed) => breed.name).join(', ')}{' '}
            {listing.species}
          </a>
          <PaperClipIcon className="w-3 h-3" strokeWidth={2} />
        </div>
        <p className="text-sm font-light text-gray-500">
          {listing.saleType}, Expires in {toCountdown(listing.expiryDate)}
        </p>
      </div>
    </button>
  );
};

export default ListingRow;
