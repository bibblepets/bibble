import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  selectListingBirthdate,
  setBirthdate
} from '../../../features/listingSlice';
import { store } from '../../../store';

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

const BirthdateSelect = ({ readOnly }: { readOnly?: boolean }) => {
  const [isDateOpen, setDateIsOpen] = useState(false);
  const [isMonthOpen, setMonthIsOpen] = useState(false);
  const [isYearOpen, setYearIsOpen] = useState(false);

  const birthdateString = useSelector(selectListingBirthdate) || Date.now();
  const birthdate = new Date(birthdateString);

  const toggleDate = useCallback(() => {
    setDateIsOpen(!isDateOpen);
  }, [isDateOpen]);

  const toggleMonth = useCallback(() => {
    setMonthIsOpen(!isMonthOpen);
  }, [isMonthOpen]);

  const toggleYear = useCallback(() => {
    setYearIsOpen(!isYearOpen);
  }, [isYearOpen]);

  const date = birthdate.getDate();
  const month = birthdate.getMonth();
  const year = birthdate.getFullYear();

  const handleDateSelected = useCallback(
    (date: number) => {
      const newBirthdate = new Date(birthdateString);
      newBirthdate.setDate(date);

      store.dispatch(setBirthdate(newBirthdate.toISOString()));
      setDateIsOpen(false);
    },
    [store, birthdateString]
  );

  const handleMonthSelected = useCallback(
    (month: number) => {
      const newBirthdate = new Date(birthdateString!);
      newBirthdate.setMonth(month);
      store.dispatch(setBirthdate(newBirthdate.toISOString()));
      setMonthIsOpen(false);
    },
    [store, birthdateString]
  );

  const handleYearSelected = useCallback(
    (year: number) => {
      const newBirthdate = new Date(birthdateString!);
      newBirthdate.setFullYear(year);
      store.dispatch(setBirthdate(newBirthdate.toISOString()));
      setYearIsOpen(false);
    },
    [store, birthdateString]
  );

  if (readOnly) {
    return (
      <a className="text-sm font-medium text-gray-700">
        {birthdate.toDateString()}
      </a>
    );
  }

  return (
    <div className="flex flex-row justify-center gap-8">
      {/* DATE */}
      <div className="flex flex-col gap-2 w-full">
        <a className="text-sm font-light text-gray-500">Date</a>
        <div className="relative">
          <button
            onClick={toggleDate}
            disabled={readOnly}
            className="flex flex-row justify-between items-center gap-4 border border-gray-300 px-4 p-2 rounded-md w-full"
          >
            <a className="text-sm font-medium text-gray-500">{date}</a>
            {!readOnly && isDateOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : !readOnly ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              ''
            )}
          </button>

          {isDateOpen && (
            <div className="absolute pb-4 w-full z-10">
              <div className="bg-white shadow-lg rounded-b-lg max-h-[180px] overflow-auto">
                <ul className="py-1">
                  {[...Array(31)].map((_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleDateSelected(index + 1)}
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
            disabled={readOnly}
            className="flex flex-row justify-between items-center gap-4 border border-gray-300 px-4 p-2 rounded-md w-full"
          >
            <a className="text-sm font-medium text-gray-500">{months[month]}</a>

            {!readOnly && isMonthOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : !readOnly ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              ''
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
                          onClick={() => handleMonthSelected(month - 1)}
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
            disabled={readOnly}
            className="flex flex-row justify-between items-center gap-4 border border-gray-300 px-4 p-2 rounded-md w-full"
          >
            <a className="text-sm font-medium text-gray-500">{year}</a>
            {!readOnly && isYearOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : !readOnly ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              ''
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
                        onClick={() => handleYearSelected(year)}
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
