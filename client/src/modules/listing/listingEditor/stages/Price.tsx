import React from 'react';
import ListingEditorSection from '../../../../components/listing/listingEditor/ListingEditorSection';
import PriceInput from '../../../../components/listing/listingEditor/price/PriceInput';

const Price = () => {
  return (
    <ListingEditorSection field="price">
      <PriceInput />
    </ListingEditorSection>
  );
};

export default Price;
