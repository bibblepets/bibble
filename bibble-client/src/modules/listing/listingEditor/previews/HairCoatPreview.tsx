import { useSelector } from 'react-redux';
import { selectListingEditorHairCoat } from '../../../../features/listing/listingEditorSlice';
import DefaultPreview from './DefaultPreview';
import { toTitleCase } from '../../../../utils/string';

const HairCoatPreview = () => {
  const hairCoat = useSelector(selectListingEditorHairCoat);

  return <DefaultPreview text={toTitleCase(hairCoat?.name)} />;
};

export default HairCoatPreview;
