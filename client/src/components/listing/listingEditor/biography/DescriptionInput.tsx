import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import {
  selectListingEditorDescription,
  setDescription
} from '../../../../features/listingEditorSlice';

const DescriptionInput = () => {
  const description = useSelector(selectListingEditorDescription) || '';
  const displayDescription = description.replace(/\[newline\]/g, '\n');

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      store.dispatch(setDescription(e.target.value));
    },
    [store]
  );

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <p className="text-xs text-gray-500">
        <span className="font-semibold">
          {5000 - (description.length || 0)}
        </span>{' '}
        characters available
      </p>
      <textarea
        className="w-full h-full text-gray-700 whitespace-pre-line rounded-lg focus:outline-none focus:shadow-outline resize-none"
        placeholder="Introduce them!"
        value={displayDescription}
        onChange={handleDescriptionChange}
        maxLength={5000}
      />
    </div>
  );
};

export default DescriptionInput;
