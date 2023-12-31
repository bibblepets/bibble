import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import OriginDropdown from '../../../../components/listing/listingEditor/biography/OriginDropdown';

const Origin = () => {
  return (
    <ListingEditorSection
      title="Origin"
      field="origin"
      description="Where were they from?"
    >
      <OriginDropdown />
    </ListingEditorSection>
  );
};

export default Origin;
