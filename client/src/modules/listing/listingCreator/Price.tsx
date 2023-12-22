import ListingStage from '../../../components/listing/listing/ListingStage';
import PriceInput from '../../../components/listing/listingCreator/price/PriceInput';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Price = () => {
  return (
    <ListingCreatorLayout>
      <ListingStage title="Price" subtitle="An impossible question, we know.">
        {/* PRICE */}
        <PriceInput />
      </ListingStage>
    </ListingCreatorLayout>
  );
};

export default Price;
