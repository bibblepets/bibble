import { useSelector } from 'react-redux';
import { selectListingEditorGender } from '../../../../features/listing/listingEditorSlice';
import DefaultPreview from './DefaultPreview';

const GenderPreview = () => {
  const gender = useSelector(selectListingEditorGender);

  return <DefaultPreview text={gender} />;
};

export default GenderPreview;
