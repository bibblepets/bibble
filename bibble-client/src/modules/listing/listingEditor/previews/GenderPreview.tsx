import { useSelector } from 'react-redux';
import { selectListingEditorGender } from '../../../../features/listing/listingEditorSlice';
import DefaultPreview from './DefaultPreview';
import { toTitleCase } from '../../../../utils/string';

const GenderPreview = () => {
  const gender = useSelector(selectListingEditorGender);

  return <DefaultPreview text={toTitleCase(gender)} />;
};

export default GenderPreview;
