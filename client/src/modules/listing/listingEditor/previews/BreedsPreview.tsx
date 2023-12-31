import React from 'react';
import { useSelector } from 'react-redux';
import { selectListingEditorBreeds } from '../../../../features/listingEditorSlice';
import DefaultPreview from './DefaultPreview';

const BreedsPreview = () => {
  const breeds = useSelector(selectListingEditorBreeds);

  return (
    <DefaultPreview
      text={breeds?.map((breed) => breed.name)?.join(', ') || 'No breeds yet'}
    />
  );
};

export default BreedsPreview;
