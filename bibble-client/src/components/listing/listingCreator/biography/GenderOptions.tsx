import { useCallback } from 'react';
import { BiFemaleSign, BiMaleSign } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import {
  selectListingCreatorGender,
  setGender
} from '../../../../features/listing/listingCreatorSlice';
import { store } from '../../../../store';
import { toCamelCase } from '../../../../utils/string';
import { Gender } from '../../../../features/types';

const GenderOptions = ({ readOnly }: { readOnly?: boolean }) => {
  const selectedGender = useSelector(selectListingCreatorGender);

  const handleClick = useCallback(
    (gender: Gender) => {
      store.dispatch(setGender(gender));
    },
    [store]
  );

  if (readOnly) {
    return (
      <div className="flex flex-row gap-2">
        <a className="text-sm font-medium text-gray-700">
          {(selectedGender && toCamelCase(selectedGender)) ||
            'No gender selected'}
        </a>
        {selectedGender === 'male' ? (
          <BiMaleSign className="w-5 h-5 text-gray-700" />
        ) : selectedGender === 'female' ? (
          <BiFemaleSign className="w-5 h-5 text-gray-700" />
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-8 justify-between">
      <button
        onClick={() => handleClick('male')}
        className={`flex flex-row justify-center p-4 rounded-lg items-center gap-4 w-full transition ${
          selectedGender === 'male' ? 'bg-sky-500' : 'bg-gray-500'
        }`}
      >
        <BiMaleSign className="w-5 h-5 text-white" />
        <a className="text-sm font-light text-white">Male</a>
      </button>

      <button
        onClick={() => handleClick('female')}
        className={`flex flex-row justify-center  p-4 rounded-lg items-center gap-4 w-full transition ${
          selectedGender === 'female' ? 'bg-rose-500' : 'bg-gray-500'
        }`}
      >
        <BiFemaleSign className="w-5 h-5 text-white" />
        <a className="text-sm font-light text-white">Female</a>
      </button>
    </div>
  );
};

export default GenderOptions;
