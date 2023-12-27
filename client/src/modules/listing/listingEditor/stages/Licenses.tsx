import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import LegalTagList from '../../../../components/listing/listingEditor/legal/LegalTagList';

const Licenses = () => {
  return (
    <ListingEditorSection
      title="Licenses"
      field="licenses"
      description="Check off the licenses your pet has received"
    >
      <LegalTagList />
    </ListingEditorSection>
  );
};

export default Licenses;
