import { PaperClipIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Listing, ListingCreator } from '../../../types';
import placeholderPup from '/images/placeholder-pup.png';
import { useNavigate } from 'react-router-dom';
import { useResume } from './hooks';

interface ListingCreatorRowProps {
  listingCreator: ListingCreator;
}

const ListingCreatorRow: React.FC<ListingCreatorRowProps> = ({
  listingCreator
}) => {
  const navigate = useNavigate();
  const resume = useResume(listingCreator);

  return (
    <button onClick={resume} className="flex flex-row gap-4">
      <div className="rounded-lg">
        {listingCreator.media ? (
          <img
            className="rounded-lg w-[52px] h-[52px] object-cover"
            src={listingCreator.media[0] ? listingCreator.media[0].url : placeholderPup}
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
            {listingCreator.biology?.breeds
              ?.map((breed) => breed.name)
              .join(', ')}{' '}
            {listingCreator.biology?.species}
          </a>
          <PaperClipIcon className="w-3 h-3" strokeWidth={2} />
        </div>
        <p className="text-sm font-light text-gray-500">
          {listingCreator.saleType}
        </p>
      </div>
    </button>
  );
};

export default ListingCreatorRow;
