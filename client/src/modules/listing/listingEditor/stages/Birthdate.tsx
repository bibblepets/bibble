import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import BirthdateSelect from '../../../../components/listing/listingEditor/biography/BirthdateSelect';

const Birthdate = () => {
  return (
    <ListingEditorSection title="Birthdate" field="birthdate">
      <BirthdateSelect />
    </ListingEditorSection>
  );
};

export default Birthdate;
