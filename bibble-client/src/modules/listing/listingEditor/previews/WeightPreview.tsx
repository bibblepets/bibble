import { useSelector } from 'react-redux';
import { selectListingEditorWeight } from '../../../../features/listing/listingEditorSlice';
import DefaultPreview from './DefaultPreview';

const WeightPreview = () => {
  const weight = useSelector(selectListingEditorWeight);

  return <DefaultPreview text={`${weight} kg`} />;
};

export default WeightPreview;
