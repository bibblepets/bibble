import { useCallback } from 'react';
import { BiFemaleSign, BiMaleSign } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import { Gender } from '../../../../types';
import {
  selectListingEditorGender,
  setGender
} from '../../../../features/listingEditorSlice';

const GenderOptions = () => {
  const selectedGender = useSelector(selectListingEditorGender);

  const handleClick = useCallback(
    (gender: Gender) => {
      store.dispatch(setGender(gender));
    },
    [store]
  );

  return (
    <div className="flex flex-row gap-8 justify-between">
      <button
        onClick={() => handleClick('Male')}
        className={`flex flex-row justify-center p-4 rounded-lg items-center gap-4 w-full transition ${
          selectedGender === 'Male' ? 'bg-sky-500' : 'bg-gray-500'
        }`}
      >
        <BiMaleSign className="w-5 h-5 text-white" />
        <a className="text-sm font-light text-white">Male</a>
      </button>

      <button
        onClick={() => handleClick('Female')}
        className={`flex flex-row justify-center  p-4 rounded-lg items-center gap-4 w-full transition ${
          selectedGender === 'Female' ? 'bg-rose-500' : 'bg-gray-500'
        }`}
      >
        <BiFemaleSign className="w-5 h-5 text-white" />
        <a className="text-sm font-light text-white">Female</a>
      </button>
    </div>
  );
};

export default GenderOptions;
