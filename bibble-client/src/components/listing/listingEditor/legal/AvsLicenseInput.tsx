import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import {
  selectListingEditorAvsLicenseNumber,
  setAvsLicenseNumber
} from '../../../../features/listing/listingEditorSlice';

const AvsLicenseInput = () => {
  const avsLicenseNumber =
    useSelector(selectListingEditorAvsLicenseNumber) || '';

  const handleAvsLicenseNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      store.dispatch(setAvsLicenseNumber(e.target.value.toUpperCase()));
    },
    [store]
  );

  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className="flex flex-row items-center gap-2">
        <label className="text-xs font-semibold text-gray-500">
          AVS license number
        </label>
        <span className="text-xxs font-light text-rose-400">
          *Immutable. Contact Bibble support for help
        </span>
      </div>
      <input
        disabled
        className={`font-light w-full p-4 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
        type="text"
        placeholder="Input AVS license number"
        value={avsLicenseNumber}
        onChange={handleAvsLicenseNumberChange}
      />
      <p className="text-xs font-light text-gray-500">
        AVS license number is verified against the Animal & Veterinary Service
        records.{' '}
      </p>
    </div>
  );
};

export default AvsLicenseInput;
