import { useSelector } from 'react-redux';
import { selectListingEditorMedia } from '../../../../features/listingEditorSlice';
import DefaultPreview from './DefaultPreview';

const MediaPreview = () => {
  const media = useSelector(selectListingEditorMedia);

  return (
    <div className="flex flex-col gap-2">
      <DefaultPreview text={`${media?.length} Images`} />
      <div className="flex justify-center my-2 h-[100px]">
        {media
          ?.slice(0, 3)
          .map((medium, index) => (
            <img
              key={index}
              src={medium.url}
              alt={`Media ${index}`}
              className={`${
                index === 0
                  ? 'translate-x-[50px] z-30'
                  : index === 2
                    ? '-translate-x-[50px] z-10'
                    : 'z-20'
              } w-[100px] h-[100px] object-cover rounded-md shadow-md`}
            />
          ))}
      </div>
    </div>
  );
};

export default MediaPreview;
