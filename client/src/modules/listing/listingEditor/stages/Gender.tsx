import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import GenderOptions from '../../../../components/listing/listingEditor/biography/GenderOptions';

const Gender = () => {
  return (
    <ListingEditorSection field="gender">
      <GenderOptions />
    </ListingEditorSection>
  );
};

export default Gender;
