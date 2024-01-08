import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectListingCreatorHairCoat,
  setHairCoat
} from '../../../../features/listing/listingCreatorSlice';
import { store } from '../../../../store';
import { selectListingOptionsHairCoats } from '../../../../features/listing/listingOptionsSlice';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useDropdown } from '../../hooks';
import { HairCoat } from '../../../../features/listing/types';
import { toCamelCase } from '../../../../utils/string';

const HairCoatSelect = ({ readOnly }: { readOnly?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedHairCoat = useSelector(selectListingCreatorHairCoat);
  const hairCoats = useSelector(selectListingOptionsHairCoats);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleHairCoatSelected = (hairCoat: HairCoat) => {
    store.dispatch(setHairCoat(hairCoat));
    setIsOpen(false);
  };

  useDropdown(dropdownRef, isOpen, setIsOpen);

  if (readOnly) {
    return (
      <a className="text-sm font-medium text-gray-700">{`${
        selectedHairCoat?.name || 'No hair coat selected'
      }`}</a>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>{`${selectedHairCoat?.name || 'Select a Hair Coat'}`}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute pb-4 w-full z-10">
          <div className="mt-2 bg-white shadow-lg rounded-b-lg max-h-[280px] overflow-auto">
            <ul className="py-1">
              {hairCoats.map((hairCoat, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleHairCoatSelected(hairCoat)}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {toCamelCase(hairCoat.name)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default HairCoatSelect;
