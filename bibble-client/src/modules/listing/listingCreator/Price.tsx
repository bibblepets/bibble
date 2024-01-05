import ListingCreatorStage from '../../../components/listing/listingCreator/ListingCreatorStage';
import PriceInput from '../../../components/listing/listingCreator/price/PriceInput';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Price = () => {
  return (
    <ListingCreatorLayout>
      <ListingCreatorStage
        title="Price"
        subtitle="An impossible question, we know."
      >
        {/* PRICE */}
        <PriceInput />
      </ListingCreatorStage>
    </ListingCreatorLayout>
  );
};

export default Price;
