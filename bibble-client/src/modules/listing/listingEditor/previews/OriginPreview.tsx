import React from 'react';
import { useSelector } from 'react-redux';
import { selectListingEditorOrigin } from '../../../../features/listingEditorSlice';
import DefaultPreview from './DefaultPreview';

const OriginPreview = () => {
  const origin = useSelector(selectListingEditorOrigin);

  return <DefaultPreview text={origin?.name || 'No origin yet'} />;
};

export default OriginPreview;
