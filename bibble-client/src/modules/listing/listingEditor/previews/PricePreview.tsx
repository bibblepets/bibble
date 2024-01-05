import { useSelector } from 'react-redux';
import { selectListingEditorPrice } from '../../../../features/listingEditorSlice';
import DefaultPreview from './DefaultPreview';

const PricePreview = () => {
  const price = useSelector(selectListingEditorPrice);

  return <DefaultPreview text={`$ ${price}`} />;
};

export default PricePreview;
