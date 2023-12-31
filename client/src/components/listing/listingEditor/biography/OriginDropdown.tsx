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
    <div className="w-full h-full lg:px-24">
      <div className="w-full relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="absolute flex items-center z-20 justify-between w-full px-8 py-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          <span>Select origin</span>
          {isOpen ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>

        {isOpen && (
          <div className="absolute top-8 border-l border-r border-b rounded-b-3xl border-gray-200 z-10 w-full">
            <div className="bg-white shadow-lg rounded-b-3xl max-h-[50vh] overflow-auto">
              <ul className="py-1 mt-8">
                {origins?.map((origin, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleOriginSelected(origin)}
                      className={`text-start block w-full px-8 py-4 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 ${
                        selectedOrigin?.name === origin.name
                          ? 'bg-gray-300 text-gray-900'
                          : ''
                      }`}
                    >
                      {origin?.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="h-[54px]" />

      <div className="flex flex-wrap flex-col lg:flex-row justify-center items-center w-full h-full gap-x-8 p-24">
        <label className="text-6xl font-medium p-8 text-gray-800">
          {selectedOrigin?.name || '...'}
        </label>
      </div>
    </div>
  );
};

export default OriginDropdown;
