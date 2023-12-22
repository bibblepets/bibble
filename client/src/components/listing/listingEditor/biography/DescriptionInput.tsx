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
    <textarea
      className="w-full px-4 py-2 text-gray-700 text-sm border whitespace-pre-line rounded-lg focus:outline-none focus:shadow-outline resize-none"
      placeholder="Introduce them!"
      value={displayDescription}
      onChange={handleDescriptionChange}
      style={{
        height: `${Math.max(80, description.split('\n').length * 20)}px`
      }}
    />
  );
};

export default DescriptionInput;
