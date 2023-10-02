import { HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import placeholder from '../../../../assets/dog1.jpeg';

const DetailsHeader = () => {
  const images = [placeholder, placeholder, placeholder, placeholder];
  return (
    <>
      {/* Head Banner */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Listing Title</h1>
          <p className="text-lg">Listing Description</p>
        </div>
        <div className="flex place-self-end gap-4">
          <button className="flex items-center gap-2 text-neutral-700">
            {true ? (
              <>
                <HeartIcon className="w-4 h-4 fill-red-400" />
                <label className="font-light text-sm">FAVOURITED</label>
              </>
              
            ) : (
              <>
                <HeartIcon className="w-4 h-4 fill-neutral-700" />
                <label className="font-light text-sm">FAVOURITE</label>
              </>
            )}
          </button>

          <hr className="w-px h-6 bg-neutral-200" />

          <button className="flex items-center gap-2 text-neutral-700">
            <ShareIcon className="w-4 h-4 text-neutral-700" />
            <label className="font-light text-sm">SHARE</label>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Cover Image */}
        <div className="w-full aspect-square overflow-hidden rounded-2xl relative">
          <img src={placeholder} className="object-cover w-full" />
        </div>

        {/* Grid of 4 Images */}
        <div className="grid grid-cols-2 gap-2">
          {images.slice(0, 4).map((img, i) => {
              return (
                <div
                  key={i}
                  className="w-full aspect-square overflow-hidden rounded-2xl relative"
                >
                  <img src={img} className="object-cover w-full" />
                </div>
              );
          })}
        </div>
      </div>
    </>
  );
};

export default DetailsHeader;
