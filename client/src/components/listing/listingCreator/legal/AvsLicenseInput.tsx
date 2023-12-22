import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import {
  selectListingCreatorAvsLicenseNumber,
  setAvsLicenseNumber
} from '../../../../features/listingCreatorSlice';

const AvsLicenseInput = ({ readOnly }: { readOnly?: boolean }) => {
  const avsLicenseNumber =
    useSelector(selectListingCreatorAvsLicenseNumber) || '';

  const handleAvsLicenseNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      store.dispatch(setAvsLicenseNumber(e.target.value.toUpperCase()));
    },
    [store]
  );

  if (readOnly) {
    return (
      <a className="text-sm font-medium text-gray-700">
        {avsLicenseNumber || 'No AVS license number provided'}
      </a>
    );
  }

  return (
    <div>
      <div>
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Input AVS license number"
          value={avsLicenseNumber}
          onChange={handleAvsLicenseNumberChange}
        />
      </div>
    </div>
  );
};

export default AvsLicenseInput;
