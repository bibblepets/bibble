import { ArrowUpCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { updateBusinessMedia } from '../../../features/business/businessSlice';
import { Media } from '../../../features/types';
import { store } from '../../../store';

type MediaUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose
}) => {
  const [media, setMedia] = useState<Media[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles?.length && media.length + acceptedFiles.length <= 12) {
        setMedia([
          ...media,
          ...acceptedFiles.map(
            (file: File) => ({ file, url: URL.createObjectURL(file) }) as Media
          )
        ]);
      } else {
        toast.error('You can only upload up to 12 photos');
      }

      if (fileRejections?.length) {
        toast.error(fileRejections[0]?.errors[0]?.message.replace(/\/\*$/, ''));
      }
    },
    [media]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  const onRemove = useCallback(
    (medium: Media) => {
      setMedia(media.filter((m) => m.url !== medium.url));
    },
    [store, media]
  );

  const onSubmit = useCallback(() => {
    store
      .dispatch(updateBusinessMedia(media))
      .then(() => {
        onClose();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [media]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-25 backdrop-filter backdrop-blur-md z-50">
      <div className="bg-white rounded-2xl shadow-lg p-12 w-full max-w-4xl">
        <div className="relative flex flex-col items-center my-4">
          <h1 className="text-2xl font-semibold mb-4">Upload Photos</h1>
          <p className="text-gray-500 mb-8">
            Upload some photos to showcase your business!
          </p>

          <div
            {...getRootProps({
              className:
                'h-84 w-5/6 rounded-lg border-[2px] border-dashed p-3 transition hover:border-gray-300 cursor-pointer'
            })}
          >
            {media.length === 0 ? (
              <div className="flex flex-col justify-center items-center gap-5 ">
                <br />
                <ArrowUpCircleIcon
                  className="h-40 w-40 text-gray-300"
                  strokeWidth={0.5}
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-lg text-gray-500">Drop files to upload</p>
                  <p className="text-sm text-gray-500">
                    or <b>browse</b> to choose files
                  </p>
                </div>
                <br />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {media?.map((medium, index) => (
                    <div
                      key={index}
                      className="relative aspect-square cursor-pointer transition hover:scale-105"
                    >
                      <button
                        className="absolute z-10 -top-2 -right-2 bg-rose-500 bg-opacity-80 transition hover:bg-opacity-100 rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(medium);
                        }}
                      >
                        <XMarkIcon className="h-4 w-4 text-white" />
                      </button>
                      <img
                        className="object-cover object-center h-full w-full rounded-lg"
                        src={medium.url}
                        onClick={() => window.open(medium.url, '_blank')}
                      />
                    </div>
                  ))}
                </div>
                <hr className="mx-16 mt-4 mb-2" />
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="text-sm text-gray-500">
                    Drop files to upload or <b>browse</b> to choose files
                  </p>
                </div>
              </div>
            )}
            <input {...getInputProps()} />
          </div>

          <br />
          <br />
          <button
            onClick={onSubmit}
            className="border rounded-full shadow-md hover:scale-95 active:scale-95 transition duration-300 text-sm px-8 py-2 text-white bg-sky-500 hover:bg-opacity-100"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadModal;
