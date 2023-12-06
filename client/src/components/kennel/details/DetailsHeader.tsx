import { HeartIcon, ShareIcon } from '@heroicons/react/24/solid';
import { Listing } from '../../../types';

interface DetailsHeaderProps {
  listing: Listing;
}

const DetailsHeader: React.FC<DetailsHeaderProps> = ({ listing }) => {
  return (
    <>
      {/* Head Banner */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">{`${listing.animal.breeds
            .map((breed) => breed.name)
            .join(', ')} ${listing.species}`}</h1>
          <p className="font-light text-gray-500">{'what to put here'}</p>
        </div>
        <div className="flex items-center place-self-end gap-4">
          <button className="flex items-center gap-2 text-neutral-700">
            {true ? (
              <>
                <HeartIcon className="w-5 h-5 fill-rose-500" />
              </>
            ) : (
              <>
                <HeartIcon className="w-5 h-5 fill-neutral-700" />
              </>
            )}
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
          <img src={listing.media[0].url} className="object-cover w-full" />
        </div>

        {/* Grid of 4 Images */}
        <div className="grid grid-cols-2 gap-2">
          {listing.media.slice(0, 4).map((img, i) => {
            return (
              <div
                key={i}
                className="w-full aspect-square overflow-hidden rounded-2xl relative"
              >
                <img src={img.url} className="object-cover w-full" />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DetailsHeader;
