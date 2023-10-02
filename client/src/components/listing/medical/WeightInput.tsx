import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';

const WeightInput = () => {
  const [weight, setWeight] = useState('0');
  const [unit, setUnit] = useState('kg');
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(event.target.value);
  };

  const convertToKg = (value: number, unit: string) => {
    switch (unit) {
      case 'kg':
        return value;
      case 'lbs':
        return value / 2.20462;
      default:
        return 0;
    }
  };

  const convertFromKg = (value: number, unit: string) => {
    switch (unit) {
      case 'kg':
        return value;
      case 'lbs':
        return value * 2.20462;
      default:
        return 0;
    }
  };

  const formatWeight = (value: number, unit: string) => {
    switch (unit) {
      case 'kg':
        return `${value.toFixed(1)} kg`;
      case 'lbs':
        return `${value.toFixed(1)} lbs`;
      default:
        return '';
    }
  };

  const handleUnitChange = (unit: string) => {
    setUnit(unit);
  };

  const weightInKg = convertToKg(parseFloat(weight), unit);
  const formattedWeight = formatWeight(weightInKg, unit);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-start gap-8">
        <div className="flex flex-col gap-2">
          <input
            className="w-48 px-2 py-[6px] text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:shadow-outline"
            type="number"
            min="0"
            step="0.1"
            placeholder="0"
            value={weight}
            onChange={handleWeightChange}
          />
          <div className="pl-2 text-gray-500 font-light">{formattedWeight}</div>
        </div>

        <div className="relative">
          <button
            onClick={toggleOpen}
            className="flex flex-row justify-between items-center gap-4 border border-gray-300 px-4 p-2 rounded-md w-full"
          >
            <a className="text-sm font-medium text-gray-500">{unit}</a>
            {isOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>

          {isOpen && (
            <div className="absolute pb-4 w-full z-10">
              <div className="bg-white shadow-lg rounded-b-lg max-h-[180px] overflow-auto">
                <ul className="py-1">
                  {['kg', 'lbs'].map((unit, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleUnitChange(unit)}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {unit}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightInput;
