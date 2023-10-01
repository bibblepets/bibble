import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useCallback, useState } from 'react';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const BirthdateSelect = () => {
  const [isDateOpen, setDateIsOpen] = useState(false);
  const [isMonthOpen, setMonthIsOpen] = useState(false);
  const [isYearOpen, setYearIsOpen] = useState(false);

  const toggleDate = useCallback(() => {
    setDateIsOpen(!isDateOpen);
  }, [isDateOpen]);

  const toggleMonth = useCallback(() => {
    setMonthIsOpen(!isMonthOpen);
  }, [isMonthOpen]);

  const toggleYear = useCallback(() => {
    setYearIsOpen(!isYearOpen);
  }, [isYearOpen]);

  return (
    <div className="flex flex-row gap-8">
      {/* DATE */}
      <div className="flex flex-col gap-2 w-full">
        <a className="text-sm font-light text-gray-500">Date</a>
        <div className="relative">
          <button
            onClick={toggleDate}
            className="flex flex-row justify-between items-center gap-4 border border-gray-300 px-4 p-2 rounded-md w-full"
          >
            <a className="text-sm font-medium text-gray-500">Date</a>
            {isDateOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>

          {isDateOpen && (
            <div className="absolute pb-4 w-full z-10">
              <div className="bg-white shadow-lg rounded-b-lg max-h-[180px] overflow-auto">
                <ul className="py-1">
                  {[...Array(31)].map((_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {}}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MONTH */}
      <div className="flex flex-col gap-2 w-full">
        <a className="text-sm font-light text-gray-500">Month</a>
        <div className="relative">
          <button
            onClick={toggleMonth}
            className="flex flex-row justify-between items-center gap-4 border border-gray-300 px-4 p-2 rounded-md w-full"
          >
            <a className="text-sm font-medium text-gray-500">Month</a>
            {isMonthOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>

          {isMonthOpen && (
            <div className="absolute pb-4 w-full z-10">
              <div className="bg-white shadow-lg rounded-b-lg max-h-[180px] overflow-auto">
                <ul className="py-1">
                  {Array.from({ length: 12 }, (_, index) => index + 1).map(
                    (month) => (
                      <li key={month}>
                        <button
                          onClick={() => {}}
                          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          {new Date(2000, month - 1, 1).toLocaleString(
                            'default',
                            { month: 'long' }
                          )}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* YEAR */}
      <div className="flex flex-col gap-2 w-full">
        <a className="text-sm font-light text-gray-500">Year</a>
        <div className="relative">
          <button
            onClick={toggleYear}
            className="flex flex-row justify-between items-center gap-4 border border-gray-300 px-4 p-2 rounded-md w-full"
          >
            <a className="text-sm font-medium text-gray-500">Year</a>
            {isYearOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>

          {isYearOpen && (
            <div className="absolute pb-4 w-full z-10">
              <div className="bg-white shadow-lg rounded-b-lg max-h-[180px] overflow-auto">
                <ul className="py-1">
                  {Array.from(
                    { length: 24 },
                    (_, index) => new Date().getFullYear() - index
                  ).map((year) => (
                    <li key={year}>
                      <button
                        onClick={() => {}}
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        {year}
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

export default BirthdateSelect;
