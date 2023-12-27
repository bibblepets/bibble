import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import { selectListingOptionsHairCoats } from '../../../../features/listingOptionsSlice';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useDropdown } from '../../hooks';
import {
  selectListingEditorHairCoat,
  setHairCoat
} from '../../../../features/listingEditorSlice';

const HairCoatSelect = () => {
  const selectedHairCoat = useSelector(selectListingEditorHairCoat);
  const hairCoats = useSelector(selectListingOptionsHairCoats);

  const handleHairCoatSelected = (hairCoat: string) => {
    store.dispatch(setHairCoat(hairCoat));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-8">
      {hairCoats.map((hairCoat, index) => (
        <button
          key={index}
          onClick={() => handleHairCoatSelected(hairCoat)}
          className={`flex justify-center border rounded-lg py-16 px-32 transition ${
            hairCoat === selectedHairCoat &&
            'border-[2px] border-gray-500 font-semibold'
          }`}
        >
          {hairCoat}
        </button>
      ))}
    </div>
  );
};

export default HairCoatSelect;
