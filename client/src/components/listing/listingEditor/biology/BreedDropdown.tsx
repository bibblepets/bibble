import { useSelector } from 'react-redux';
import {
  addBreed,
  removeBreed,
  selectListingEditorBreeds,
  selectListingEditorSpecies
} from '../../../../features/listingEditorSlice';
import { selectListingOptionsBreeds } from '../../../../features/listingOptionsSlice';
import { useCallback, useRef, useState } from 'react';
import { Breed } from '../../../../types';
import { store } from '../../../../store';
import { useDropdown } from '../../hooks';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const BreedDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedSpecies = useSelector(selectListingEditorSpecies);
  const selectedBreeds = useSelector(selectListingEditorBreeds);
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

  const onRemove = useCallback(
    (breed: Breed) => {
      store.dispatch(removeBreed(breed));
    },
    [store]
  );

  useDropdown(dropdownRef, isOpen, setIsOpen);

  return (
    <div className="w-full h-full lg:px-24">
      <div className="w-full relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="absolute flex items-center z-20 justify-between w-full px-8 py-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none"
          disabled={!selectedSpecies}
        >
          <span>Select breeds</span>
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
                {breeds?.map((breed, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleBreedSelected(breed)}
                      className={`text-start block w-full px-8 py-4 text-sm text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 ${
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

      <div className="h-[54px]" />

      <div className="flex flex-wrap flex-col lg:flex-row justify-center items-center w-full h-full gap-x-8 p-24">
        {selectedBreeds?.map((breed, index) => (
          <div key={index}>
            <label
              onClick={() => onRemove(breed)}
              className="text-6xl font-medium p-8 text-gray-800 cursor-pointer transition hover:text-rose-500 overflow-hidden whitespace-nowrap"
            >
              {breed.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreedDropdown;
