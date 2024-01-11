import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import {
  selectListingEditorGender,
  selectListingEditorSize,
  setSize
} from '../../../../features/listing/listingEditorSlice';
import { Size } from '../../../../features/listing/types';
import { toTitleCase } from '../../../../utils/string';

const sizes: Size[] = ['small', 'medium', 'large'];

const SizeOptions = () => {
  const selectedSize = useSelector(selectListingEditorSize);
  const selectedGender = useSelector(selectListingEditorGender);

  const handleClick = useCallback(
    (size: Size) => {
      store.dispatch(setSize(size));
    },
    [store]
  );

  return (
    <div className="flex flex-col gap-8 items-center">
      <p className="text-sm text-gray-500">
        How big is {selectedGender === 'Male' ? 'he' : 'she'}?
      </p>
      <div className="flex flex-row gap-8 justify-center">
        {sizes.map((size, index) => (
          <button
            key={index}
            onClick={() => handleClick(size)}
            className={`flex flex-row justify-center p-4 rounded-lg w-32 items-center gap-4 transition ${
              selectedSize === size ? 'bg-sky-500' : 'bg-gray-500'
            }`}
          >
            <a className="text-xl font-light text-white">{toTitleCase(size)}</a>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeOptions;
