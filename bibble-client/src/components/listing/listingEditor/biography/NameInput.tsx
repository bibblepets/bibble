import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import {
  selectListingEditorName,
  setName
} from '../../../../features/listing/listingEditorSlice';

const NameInput = () => {
  const name = useSelector(selectListingEditorName);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      store.dispatch(setName(e.target.value));
    },
    [store]
  );

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <p className="text-xs text-gray-500">
        <span className="font-semibold">{50 - (name?.length || 0)}</span>{' '}
        characters available
      </p>
      <input
        className={`text-8xl p-2 text-gray-800 focus:outline-none text-center w-full`}
        type="text"
        value={name}
        placeholder="..."
        onChange={handleNameChange}
        maxLength={50}
      />
    </div>
  );
};

export default NameInput;
