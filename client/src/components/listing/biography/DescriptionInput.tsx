import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  selectListingDescription,
  setDescription
} from '../../../features/listingSlice';
import { store } from '../../../store';

const DescriptionInput = ({ readOnly }: { readOnly?: boolean }) => {
  const description = useSelector(selectListingDescription) || '';
  const displayDescription = description.replace(/\[newline\]/g, '\n');

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value.replace(/\n/g, '[newline]');
      store.dispatch(setDescription(value));
    },
    [store]
  );

  if (readOnly) {
    return <p className="text-gray text-sm">{displayDescription}</p>;
  }

  return (
    <textarea
      disabled={readOnly}
      className="w-full px-4 py-2 text-gray-700 text-sm border rounded-lg focus:outline-none focus:shadow-outline resize-none"
      placeholder="Introduce them!"
      value={displayDescription}
      onChange={handleDescriptionChange}
      style={{
        height: `${Math.max(80, description.split('[newline]').length * 20)}px`
      }}
    />
  );
};

export default DescriptionInput;
