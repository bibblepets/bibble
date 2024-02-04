import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  selectCurrentBusiness,
  updateBusinessMedia
} from '../../../features/business/businessSlice';
import { Media } from '../../../features/types';
import { store } from '../../../store';
import { BusinessProfileComponentProps } from './BusinessProfileSection';

const EditBusinessProfileMedia: React.FC<BusinessProfileComponentProps> = ({
  setIsEditing
}) => {
  const currentBusiness = useSelector(selectCurrentBusiness);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [media, setMedia] = useState<Media[]>(currentBusiness?.media || []);

  const isSelected = (medium: Media) =>
    selectedMedia.map((m) => m.url).includes(medium?.url);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles?.length) {
        setMedia([
          ...media,
          ...acceptedFiles.map(
            (file: File) => ({ file, url: URL.createObjectURL(file) }) as Media
          )
        ]);
      }

      if (fileRejections?.length) {
        toast.error(fileRejections[0]?.errors[0]?.message.replace(/\/\*$/, ''));
      }
    },
    [store, media]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  const onRemove = useCallback(() => {
    setMedia(media.filter((m) => !isSelected(m)));
  }, [store, selectedMedia]);

  const onManage = useCallback(() => {
    if (isSelecting) {
      setSelectedMedia([]);
    }

    setSelectedMedia([]);
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

  const onSubmit = useCallback(() => {
    store
      .dispatch(updateBusinessMedia(media))
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        toast.error('Failed to update contact information');
      });
  }, [store, media]);

  return (
    <>
      <div className="flex flex-row gap-8 justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-800">Description</h2>
        <button
          onClick={onSubmit}
          className="border rounded-lg px-4 py-1 transition text-gray-400 hover:text-gray-500 hover:border-gray-400"
        >
          <label className="text-sm cursor-pointer">Done</label>
        </button>
      </div>
      <div className="flex flex-col gap-8">
        <div
          {...getRootProps({
            className:
              'flex flex-col items-center w-full rounded-lg border-[2px] border-dashed p-3 transition hover:border-gray-300 cursor-pointer'
          })}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((medium, index) => (
              <div
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(medium);
                }}
                className={`relative aspect-[4/3] cursor-pointer transition hover:scale-105 rounded-lg transition ${
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
          <br />
          <p className="text-sm text-gray-500">
            Drop files to upload or <b>browse</b> to choose files
          </p>
          <input {...getInputProps()} />
        </div>
        <div className="flex flex-row gap-4">
          {/* MANAGE BUTTON */}
          <button
            onClick={onManage}
            className={`flex justify-center items-center h-[38px] px-4 bg-gray-200 rounded-full transition hover:scale-95 hover:opacity-80 ${
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
        </div>
      </div>
    </>
  );
};

export default EditBusinessProfileMedia;
