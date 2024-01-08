import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  selectListingCreatorSize,
  setSize
} from '../../../../features/listing/listingCreatorSlice';
import { Size } from '../../../../types';
import { store } from '../../../../store';
import { toCamelCase } from '../../../../utils/string';

const sizes: Size[] = ['Small', 'Medium', 'Large'];

const SizeOptions = ({ readOnly }: { readOnly?: boolean }) => {
  const selectedSize = useSelector(selectListingCreatorSize);

  const handleClick = useCallback(
    (size: Size) => {
      store.dispatch(setSize(size));
    },
    [store]
  );

  if (readOnly) {
    return (
      <div className="flex flex-row gap-2">
        <a className="text-sm font-medium text-gray-700">
          {(selectedSize && toCamelCase(selectedSize)) || 'No size selected'}
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-8 justify-between">
      {sizes.map((size, index) => (
        <button
          key={index}
          onClick={() => handleClick(size)}
          className={`flex flex-row justify-center p-4 rounded-lg items-center gap-4 w-full transition ${
            selectedSize === size ? 'bg-sky-500' : 'bg-gray-500'
          }`}
        >
          <a className="text-sm font-light text-white">{size}</a>
        </button>
      ))}
    </div>
  );
};

export default SizeOptions;
