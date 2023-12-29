import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  selectListingCreatorDescription,
  setDescription
} from '../../../../features/listingCreatorSlice';
import { store } from '../../../../store';

const DescriptionInput = ({ readOnly }: { readOnly?: boolean }) => {
  const description = useSelector(selectListingCreatorDescription) || '';
  const displayDescription = description.replace(/\[newline\]/g, '\n');

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      store.dispatch(setDescription(e.target.value));
    },
    [store]
  );

  if (readOnly) {
    return (
      <p className="text-gray text-sm whitespace-pre-line">
        {displayDescription || 'No description provided'}
      </p>
    );
  }

  return (
    <div className="relative">
      <textarea
        className="w-full px-4 py-2 text-gray-700 text-sm border whitespace-pre-line rounded-lg focus:outline-none focus:shadow-outline resize-none"
        placeholder="Introduce them!"
        value={displayDescription}
        onChange={handleDescriptionChange}
        maxLength={5000}
        style={{
          height: `${Math.max(80, description.split('\n').length * 20)}px`
        }}
      />
      <p className="absolute bottom-4 right-6 text-xs text-gray-500">
        {5000 - displayDescription.length} characters left
      </p>
    </div>
  );
};

export default DescriptionInput;
