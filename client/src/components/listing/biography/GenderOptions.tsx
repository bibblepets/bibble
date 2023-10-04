import { useCallback } from 'react';
import { BiFemaleSign, BiMaleSign } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { selectListingGender, setGender } from '../../../features/listingSlice';
import { store } from '../../../store';
import { Gender } from '../../../types';
import { toCamelCase } from '../../../utils/string';

const GenderOptions = ({ readOnly }: { readOnly?: boolean }) => {
  const selectedGender = useSelector(selectListingGender);

  const handleClick = useCallback(
    (gender: Gender) => {
      store.dispatch(setGender(gender));
    },
    [store]
  );

  if (readOnly) {
    return (
      <div className="flex flex-row justify-center">
        <button
          disabled
          className={`flex flex-row justify-center p-4 rounded-lg items-center gap-4 w-1/2 transition ${
            selectedGender === 'MALE'
              ? 'bg-sky-500'
              : selectedGender === 'FEMALE'
              ? 'bg-rose-500'
              : 'bg-gray-500'
          }`}
        >
          {selectedGender === 'MALE' ? (
            <BiMaleSign className="w-5 h-5 text-white" />
          ) : selectedGender === 'FEMALE' ? (
            <BiFemaleSign className="w-5 h-5 text-white" />
          ) : (
            ''
          )}
          <a className="text-sm font-light text-white">
            {selectedGender && toCamelCase(selectedGender)}
          </a>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-8 justify-between">
      <button
        onClick={() => handleClick('MALE')}
        className={`flex flex-row justify-center p-4 rounded-lg items-center gap-4 w-full transition ${
          selectedGender === 'MALE' ? 'bg-sky-500' : 'bg-gray-500'
        }`}
      >
        <BiMaleSign className="w-5 h-5 text-white" />
        <a className="text-sm font-light text-white">Male</a>
      </button>

      <button
        onClick={() => handleClick('FEMALE')}
        className={`flex flex-row justify-center  p-4 rounded-lg items-center gap-4 w-full transition ${
          selectedGender === 'FEMALE' ? 'bg-rose-500' : 'bg-gray-500'
        }`}
      >
        <BiFemaleSign className="w-5 h-5 text-white" />
        <a className="text-sm font-light text-white">Female</a>
      </button>
    </div>
  );
};

export default GenderOptions;
