import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectListingOrigin, setOrigin } from '../../../features/listingSlice';
import { store } from '../../../store';
import { Country } from '../../../types';

const dummyOrigins = [
  { name: 'Singapore' },
  { name: 'Malaysia' },
  { name: 'Indonesia' },
  { name: 'Thailand' },
  { name: 'Philippines' },
  { name: 'Vietnam' },
  { name: 'Myanmar' },
  { name: 'Cambodia' },
  { name: 'Laos' },
  { name: 'Brunei' },
  { name: 'East Timor' }
];

const OriginDropdown = ({ readOnly }: { readOnly?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOrigin = useSelector(selectListingOrigin);
  const origins = dummyOrigins;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOriginSelected = (origin: Country) => {
    store.dispatch(setOrigin(origin));
    setIsOpen(false);
  };

  if (readOnly) {
    return (
      <a className="text-sm font-medium text-gray-700">{`${
        selectedOrigin?.name || 'No origin selected'
      }`}</a>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        disabled={readOnly}
        className={`flex items-center justify-between w-full px-4 p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none ${
          readOnly && 'hover:bg-white'
        }`}
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
