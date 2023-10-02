import { PhotoIcon, PlusIcon } from '@heroicons/react/24/outline';
import dog1 from '../../../assets/dog1.jpeg';
import dog8 from '../../../assets/dog8.jpeg';

const dummyMedia = [dog1, dog8, dog1, dog8, dog1, dog8, dog1, dog8];

const MediaUpload = () => {
  const media = dummyMedia;

  return (
    <div className="flex flex-col items-center gap-8">
      {media.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <PhotoIcon className="w-12 h-12 text-gray-500" />
          <div className="flex flex-col items-center gap-1">
            <a className="font-medium">No media</a>
            <p className="text-sm font-light text-gray-500">
              Get started by adding a photo or video.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {media.map((medium, index) => (
            <div
              key={index}
              className="aspect-square cursor-pointer transition hover:scale-105"
            >
              <img
                className="object-cover object-center h-full w-full rounded-lg"
                src={medium}
              />
            </div>
          ))}
        </div>
      )}

      <button className="flex flex-row gap-2 items-center rounded-lg bg-sky-500 px-3 py-2 text-white transition hover:scale-95 hover:opacity-80">
        <PlusIcon className="w-4 h-4" strokeWidth={3} />
        <a className="font-medium text-sm">New Upload</a>
      </button>
    </div>
  );
};

export default MediaUpload;
