import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import {
  selectListingEditorName,
  setName
} from '../../../../features/listingEditorSlice';

const NameInput = () => {
  const name = useSelector(selectListingEditorName);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      store.dispatch(setName(e.target.value));
    },
    [store]
  );

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
