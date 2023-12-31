import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import BreedDropdown from '../../../../components/listing/listingEditor/biology/BreedDropdown';

const Breeds = () => {
  return (
    <ListingEditorSection
      title="Breeds"
      field="breeds"
      description="What breed(s) is your pet?"
    >
      <BreedDropdown />
    </ListingEditorSection>
  );
};

export default Breeds;
