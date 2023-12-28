import { useSelector } from 'react-redux';
import { selectListingEditorName } from '../../../../features/listingEditorSlice';
import DefaultPreview from './DefaultPreview';

const NamePreview = () => {
  const name = useSelector(selectListingEditorName);

  return <DefaultPreview text={name} />;
};

export default NamePreview;
