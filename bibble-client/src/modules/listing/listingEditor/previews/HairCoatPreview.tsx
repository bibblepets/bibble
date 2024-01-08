import { useSelector } from 'react-redux';
import { selectListingEditorHairCoat } from '../../../../features/listing/listingEditorSlice';
import DefaultPreview from './DefaultPreview';

const HairCoatPreview = () => {
  const hairCoat = useSelector(selectListingEditorHairCoat);

  return <DefaultPreview text={hairCoat} />;
};

export default HairCoatPreview;
