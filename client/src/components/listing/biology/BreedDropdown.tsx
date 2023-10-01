import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface BreedDropdownProps {
  breeds: string[];
  selectedBreed: string;
  onBreedSelected: (breed: string) => void;
}

const BreedDropdown: React.FC<BreedDropdownProps> = ({
  breeds,
  selectedBreed,
  onBreedSelected
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleBreedSelected = (breed: string) => {
    onBreedSelected(breed);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-4 p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>{selectedBreed}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute pb-4 w-full z-10">
          <div className="mt-2 bg-white shadow-lg rounded-b-lg max-h-[360px] overflow-auto">
            <ul className="py-1">
              {breeds.map((breed, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleBreedSelected(breed)}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    {breed}
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
