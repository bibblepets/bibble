import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import { Country } from '../../../../types';
import { selectListingOptionsCountries } from '../../../../features/listingOptionsSlice';
import { useDropdown } from '../../hooks';
import {
  selectListingEditorOrigin,
  setOrigin
} from '../../../../features/listingEditorSlice';

const OriginDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOrigin = useSelector(selectListingEditorOrigin);
  const origins = useSelector(selectListingOptionsCountries);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOriginSelected = (origin: Country) => {
    store.dispatch(setOrigin(origin));
    setIsOpen(false);
  };

  useDropdown(dropdownRef, isOpen, setIsOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>{`${selectedOrigin?.name || 'Select a Country'}`}</span>
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
              {origins.map((origin, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleOriginSelected(origin)}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {origin.name}
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

export default OriginDropdown;
