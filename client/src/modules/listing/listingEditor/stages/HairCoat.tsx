import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import HairCoatSelect from '../../../../components/listing/listingEditor/medical/HairCoatSelect';

const HairCoat = () => {
  return (
    <ListingEditorSection
      title="Hair Coat"
      field="hairCoat"
      description="What kind of fur do they have?"
    >
      <HairCoatSelect />
    </ListingEditorSection>
  );
};

export default HairCoat;
