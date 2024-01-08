import { PhotoIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import {
  addMedia,
  removeMedia,
  selectListingCreatorMedia
} from '../../../../features/listing/listingCreatorSlice';
import { store } from '../../../../store';
import { Media } from '../../../../types';
import toast from 'react-hot-toast';

const MediaUpload = ({ readOnly }: { readOnly?: boolean }) => {
  const media = useSelector(selectListingCreatorMedia) || [];

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

  const onRemove = useCallback(
    (media: Media) => {
      store.dispatch(removeMedia(media));
    },
    [store]
  );

  return (
    <div className="flex flex-col items-center gap-8">
      {media?.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <PhotoIcon className="w-12 h-12 text-gray-500" />
          <div className="flex flex-col items-center gap-1">
            <a className="font-medium">No media</a>
            {!readOnly && (
              <p className="text-sm font-light text-gray-500">
                Get started by adding a photo or video.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {media?.map((medium, index) => (
            <div
              key={index}
              className="relative aspect-square cursor-pointer transition hover:scale-105"
            >
              {!readOnly && (
                <button
                  className="absolute z-10 -top-2 -right-2 bg-rose-500 bg-opacity-80 transition hover:bg-opacity-100 rounded-full p-1"
                  onClick={() => onRemove(medium)}
                >
                  <XMarkIcon className="h-4 w-4 text-white" />
                </button>
              )}
              <img
                className="object-cover object-center h-full w-full rounded-lg"
                src={medium.url}
                onClick={() => window.open(medium.url, '_blank')}
              />
            </div>
          ))}
        </div>
      )}
      {/* UPLOAD BUTTON */}
      {!readOnly && (
        <div
          {...getRootProps({
            className:
              'flex flex-row gap-2 items-center rounded-lg bg-sky-500 px-3 py-2 text-white transition hover:scale-95 hover:opacity-80 cursor-pointer'
          })}
        >
          <input {...getInputProps()} />
          <PlusIcon className="w-4 h-4" strokeWidth={3} />
          <a className="font-medium text-sm">New Upload</a>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
