import {
  CheckIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import { Media } from '../../../../types';
import toast from 'react-hot-toast';
import {
  addMedia,
  removeMedia,
  selectListingEditorMedia
} from '../../../../features/listingEditorSlice';

const MediaUpload = () => {
  const media = useSelector(selectListingEditorMedia) || [];
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  console.log(selectedMedia);

  const isSelected = (medium: Media) =>
    selectedMedia.map((m) => m.url).includes(medium?.url);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles?.length) {
        store.dispatch(
          addMedia(
            acceptedFiles.map(
              (file: File) =>
                ({ file, url: URL.createObjectURL(file) }) as Media
            )
          )
        );
      }

      if (fileRejections?.length) {
        toast.error(fileRejections[0]?.errors[0]?.message.replace(/\/\*$/, ''));
      }
    },
    [store]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  const onRemove = useCallback(() => {
    store.dispatch(removeMedia(selectedMedia));
  }, [store, selectedMedia]);

  const onManage = useCallback(() => {
    if (isSelecting) {
      setSelectedMedia([]);
    }

    setIsSelecting(!isSelecting);
  }, [isSelecting]);

  const onSelect = useCallback(
    (medium: Media) => {
      if (isSelected(medium)) {
        setSelectedMedia(selectedMedia.filter((m) => m.url !== medium.url));
      } else {
        setSelectedMedia([...selectedMedia, medium]);
      }
    },
    [selectedMedia]
  );

  return (
    <div className="flex flex-col items-center gap-8">
      {media?.length === 0 ? (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
          {media?.map((medium, index) => (
            <div
              key={index}
              onClick={() => onSelect(medium)}
              className={`relative aspect-square cursor-pointer transition hover:scale-105 rounded-lg transition ${
                isSelecting && 'border border-gray-200'
              } ${
                isSelecting &&
                isSelected(medium) &&
                'scale:105 border-[2px] border-gray-600'
              }`}
            >
              {isSelecting && isSelected(medium) && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-2">
                  <CheckIcon className="w-3 h-3 text-gray-800" />
                </div>
              )}
              <img
                className="object-cover object-center h-full w-full rounded-md"
                src={medium.url}
                onClick={() =>
                  !isSelecting && window.open(medium.url, '_blank')
                }
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-row gap-4">
        {/* MANAGE BUTTON */}
        <button
          onClick={onManage}
          className={`flex justify-center items-center px-4 bg-gray-200 rounded-full transition hover:scale-95 hover:opacity-80 ${
            isSelecting && 'scale-95 opacity-80 text-gray-500'
          }`}
        >
          <label className="text-sm cursor-pointer">Manage photos</label>
        </button>

        {/* REMOVE BUTTON */}
        {isSelecting && (
          <button
            onClick={onRemove}
            className="rounded-full text-gray-800 bg-gray-200 transition hover:bg-rose-500 hover:text-white hover:scale-95 hover:opacity-80 p-3"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}

        {/* UPLOAD BUTTON */}
        <div
          {...getRootProps({
            className:
              'flex flex-row gap-2 items-center rounded-full bg-sky-500 p-3 text-white transition hover:scale-95 hover:opacity-80 cursor-pointer'
          })}
        >
          <input {...getInputProps()} />
          <PlusIcon className="w-4 h-4" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default MediaUpload;
