import { useSelector } from 'react-redux';
import {
  selectCurrentUser,
  updateProfilePicture
} from '../../../features/user/userSlice';
import paw from '../../../../public/images/paw.jpeg';
import { CameraIcon, CheckIcon } from '@heroicons/react/24/outline';
import { selectMyListings } from '../../../features/listing/listingSlice';
import { toTimeAgo } from '../../../utils/date';
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { store } from '../../../store';
import { Media } from '../../../features/types';

const UserPanel = () => {
  const currentUser = useSelector(selectCurrentUser);
  const myListings = useSelector(selectMyListings);
  const { time, unit } = toTimeAgo(currentUser?.createdAt);
  const [searchParams] = useSearchParams();

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles?.length === 1) {
        const file = acceptedFiles[0];

        store.dispatch(
          updateProfilePicture({
            file,
            url: URL.createObjectURL(file)
          } as Media)
        );
      } else if (acceptedFiles?.length > 1) {
        toast.error('You can only upload one image at a time.');
      }

      if (fileRejections?.length) {
        toast.error(fileRejections[0]?.errors[0]?.message.replace(/\/\*$/, ''));
      }
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  if (searchParams.get('edit')) {
    return (
      <section className="w-full lg:w-[440px] p-12">
        <div className="relative flex justify-center">
          <img
            className="object-cover rounded-full w-56 h-56 border"
            src={currentUser?.profilePic?.url || paw}
            alt="profile-pic"
          />
          <div
            {...getRootProps({
              className:
                'absolute -bottom-3 flex flex-row gap-2 py-2 px-4 bg-white shadow-lg rounded-full transition hover:shadow-sm'
            })}
          >
            <input {...getInputProps()} />
            <CameraIcon className="w-5 h-5 cursor-pointer text-gray-800 transition hover:text-gray-500" />
            <label className="text-sm font-medium cursor-pointer text-gray-800 transition hover:text-gray-500">
              Edit
            </label>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full lg:w-[440px] p-12">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-row w-[412px] lg:w-full shadow-xl rounded-xl p-4">
          <div className="flex flex-col items-center w-[200px] my-4">
            <img
              className="object-cover rounded-full w-28 h-28 border"
              src={currentUser?.profilePic?.url || paw}
              alt="profile-pic"
            />
            <div className="h-[12px]" />
            <label className="text-2xl font-bold text-gray-800">
              {currentUser?.firstName}
            </label>
          </div>
          <div className="flex flex-col justify-center flex-grow">
            <div className="flex flex-col">
              <label className="text-xl font-bold text-gray-800">
                {myListings.length}
              </label>
              <label className="text-xxs font-medium text-gray-800">
                Listings
              </label>
            </div>
            <hr className="my-4 mx-2" />
            <label className="text-xl font-bold text-gray-800">{time}</label>
            <label className="text-xxs font-medium text-gray-800">
              {unit} on Bibble
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-[412px] lg:w-full border rounded-xl p-6">
          <label className="text-xl font-semibold text-gray-800 pb-2">
            {currentUser?.firstName}'s confirmed information
          </label>
          {true && (
            <div className="flex flex-row gap-3">
              <CheckIcon className="w-6 h-6 text-gray-800" />
              <label className="text-gray-800">Identity</label>
            </div>
          )}
          {true && (
            <div className="flex flex-row gap-3">
              <CheckIcon className="w-6 h-6 text-gray-800" />
              <label className="text-gray-800">Personal phone number</label>
            </div>
          )}
          {true && (
            <div className="flex flex-row gap-3">
              <CheckIcon className="w-6 h-6 text-gray-800" />
              <label className="text-gray-800">Personal email </label>
            </div>
          )}
          {true && (
            <div className="flex flex-row gap-3">
              <CheckIcon className="w-6 h-6 text-gray-800" />
              <label className="text-gray-800">Business phone number</label>
            </div>
          )}
          {true && (
            <div className="flex flex-row gap-3">
              <CheckIcon className="w-6 h-6 text-gray-800" />
              <label className="text-gray-800">Business email</label>
            </div>
          )}
          <p
            onClick={() => alert('TODO: learn more modal')}
            className="text-sm font-semibold underline text-gray-800 pt-2 cursor-pointer"
          >
            Learn about identity verification
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserPanel;
