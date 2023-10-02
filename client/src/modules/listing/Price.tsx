import ListingStage from '../../components/listing/listing/ListingStage';
import PriceInput from '../../components/listing/price/PriceInput';
import ListingLayout from '../../layouts/ListingLayout';

const Price = () => {
  return (
    <ListingLayout>
      <ListingStage title="Price" subtitle="How much?">
        {/* PRICE */}
        <PriceInput />
      </ListingStage>
    </ListingLayout>
  );
};

export default Price;
