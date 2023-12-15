import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  selectListingHairCoat,
  setHairCoat
} from '../../../features/listingSlice';
import { store } from '../../../store';

const HairCoatInput = ({ readOnly }: { readOnly?: boolean }) => {
  const hairCoat = useSelector(selectListingHairCoat);

  const handleHairCoatChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      store.dispatch(setHairCoat(e.target.value));
    },
    [store]
  );

  if (readOnly) {
    return (
      <a className="text-sm font-medium text-gray-700">
        {hairCoat || 'No hair coat selected'}
      </a>
    );
  }

  return (
    <div>
      <input
        className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
        type="text"
        placeholder="What's their fur like?"
        value={hairCoat}
        onChange={handleHairCoatChange}
      />
    </div>
  );
};

export default HairCoatInput;
