import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import { selectListingEditorAvsLicenseNumber } from '../../../../features/listingEditorSlice';
import { setAvsLicenseNumber } from '../../../../features/listingCreatorSlice';

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
