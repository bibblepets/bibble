import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../store';
import {
  selectListingCreatorName,
  setName
} from '../../../features/listingCreatorSlice';

const NameInput = ({ readOnly }: { readOnly?: boolean }) => {
  const name = useSelector(selectListingCreatorName);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      store.dispatch(setName(e.target.value));
    },
    [store]
  );

  if (readOnly) {
    return (
      <a className="text-sm font-medium text-gray-700">
        {name || 'N/A'}
      </a>
    );
  }

  return (
    <div>
      <div>
        <input
          className={`text-sm w-full p-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline`}
          type="text"
          placeholder="Do we have a name yet?"
          value={name}
          onChange={handleNameChange}
        />
      </div>
    </div>
  );
};

export default NameInput;
