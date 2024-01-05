import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import VaccinationList from '../../../../components/listing/listingEditor/medical/VaccinationList';

const Vaccinations = () => {
  return (
    <ListingEditorSection
      title="Vaccinations"
      field="vaccines"
      description="Check off the vaccinations your pet has received"
    >
      <VaccinationList />
    </ListingEditorSection>
  );
};

export default Vaccinations;
