import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  addBreed,
  removeBreed,
  selectListingCreatorBreeds,
  selectListingCreatorSpecies
} from '../../../../features/listingCreatorSlice';
import { store } from '../../../../store';
import { Breed } from '../../../../types';
import { selectListingOptionsBreeds } from '../../../../features/listingOptionsSlice';
import { useDropdown } from '../../hooks';

const BreedDropdown = ({ readOnly }: { readOnly?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedSpecies = useSelector(selectListingCreatorSpecies);
  const selectedBreeds = useSelector(selectListingCreatorBreeds);
  const allBreeds = useSelector(selectListingOptionsBreeds);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const breeds = allBreeds
    .filter((breed) => breed.species === selectedSpecies)
    .sort((a, b) => a.name.localeCompare(b.name));

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleBreedSelected = useCallback(
    (breed: Breed) => {
      if (selectedBreeds?.map((breed) => breed.name).includes(breed.name)) {
        store.dispatch(removeBreed(breed));
      } else {
        store.dispatch(addBreed(breed));
      }
    },
    [store, selectedBreeds]
  );

  useDropdown(dropdownRef, isOpen, setIsOpen);

  if (readOnly) {
    return (
      <a className="text-sm font-medium text-gray-700">{`${
        selectedBreeds?.map((breed) => breed.name).join(', ') ||
        'No breed selected'
      }`}</a>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
        disabled={!selectedSpecies}
      >
        <span>{`${
          !selectedSpecies
            ? 'Select a species'
            : selectedBreeds?.map((breed) => breed.name).join(', ') ||
              'Select a breed'
        }`}</span>
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
              {breeds?.map((breed, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleBreedSelected(breed)}
                    className={`block w-full px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 ${
                      selectedBreeds
                        ?.map((breed) => breed.name)
                        .includes(breed.name)
                        ? 'bg-gray-300 text-gray-900'
                        : ''
                    }`}
                  >
                    {breed?.name}
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

export default BreedDropdown;
