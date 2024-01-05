import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import BirthdateSelect from '../../../../components/listing/listingEditor/biography/BirthdateSelect';

const Birthdate = () => {
  return (
    <ListingEditorSection
      title="Birthday"
      field="birthdate"
      description="When were they born? Set an estimated birthdate if you are unsure"
    >
      <BirthdateSelect />
    </ListingEditorSection>
  );
};

export default Birthdate;
