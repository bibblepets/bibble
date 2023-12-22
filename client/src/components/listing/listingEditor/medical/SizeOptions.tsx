import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Size } from '../../../../types';
import { store } from '../../../../store';
import {
  selectListingEditorSize,
  setSize
} from '../../../../features/listingEditorSlice';

const sizes: Size[] = ['Small', 'Medium', 'Large'];

const SizeOptions = () => {
  const selectedSize = useSelector(selectListingEditorSize);

  const handleClick = useCallback(
    (size: Size) => {
      store.dispatch(setSize(size));
    },
    [store]
  );

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
