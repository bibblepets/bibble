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
    <div className="flex flex-col items-center gap-12">
      <p className="text-sm text-gray-500">Boy or girl?</p>
      <div className="flex flex-row gap-16 justify-between items-center w-[580px]">
        <button
          onClick={() => handleClick('Male')}
          className={`flex flex-row justify-center p-6 rounded-full items-center gap-4 transition ${
            selectedGender === 'Male' ? 'bg-sky-500' : 'bg-gray-500'
          }`}
        >
          <BiMaleSign className="w-5 h-5 text-white" />
        </button>

        <label className="text-gray-800 text-8xl">{selectedGender}</label>

        <button
          onClick={() => handleClick('Female')}
          className={`flex flex-row justify-center p-6 rounded-full items-center gap-4 transition ${
            selectedGender === 'Female' ? 'bg-rose-500' : 'bg-gray-500'
          }`}
        >
          <BiFemaleSign className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default GenderOptions;
