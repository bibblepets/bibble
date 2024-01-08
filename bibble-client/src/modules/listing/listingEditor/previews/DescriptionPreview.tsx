import { useSelector } from 'react-redux';
import { selectListingEditorDescription } from '../../../../features/listing/listingEditorSlice';
import DefaultPreview from './DefaultPreview';

const DescriptionPreview = () => {
  const description = useSelector(selectListingEditorDescription);

  return <DefaultPreview text={description} />;
};

export default DescriptionPreview;
