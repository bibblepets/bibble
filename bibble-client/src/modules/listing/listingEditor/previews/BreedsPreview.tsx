import React from 'react';
import { useSelector } from 'react-redux';
import { selectListingEditorBreeds } from '../../../../features/listing/listingEditorSlice';
import DefaultPreview from './DefaultPreview';
import { toTitleCase } from '../../../../utils/string';

const BreedsPreview = () => {
  const breeds = useSelector(selectListingEditorBreeds);

  return (
    <DefaultPreview
      text={
        breeds?.map((breed) => toTitleCase(breed.name))?.join(', ') ||
        'No breeds yet'
      }
    />
  );
};

export default BreedsPreview;
