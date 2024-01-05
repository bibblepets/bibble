import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import WeightInput from '../../../../components/listing/listingEditor/medical/WeightInput';
import SizeOptions from '../../../../components/listing/listingEditor/medical/SizeOptions';

const Weight = () => {
  return (
    <ListingEditorSection
      title="Size & weight"
      field="weight"
      description="Input their size and weight"
    >
      <div className="flex flex-col gap-16 w-full">
        <SizeOptions />
        <WeightInput />
      </div>
    </ListingEditorSection>
  );
};

export default Weight;
