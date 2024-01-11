import React from 'react';
import { useSelector } from 'react-redux';
import { selectListingEditorOrigin } from '../../../../features/listing/listingEditorSlice';
import DefaultPreview from './DefaultPreview';
import { toTitleCase } from '../../../../utils/string';

const OriginPreview = () => {
  const origin = useSelector(selectListingEditorOrigin);

  return <DefaultPreview text={toTitleCase(origin?.name) || 'No origin yet'} />;
};

export default OriginPreview;
