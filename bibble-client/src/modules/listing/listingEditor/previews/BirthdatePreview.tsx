import { useSelector } from 'react-redux';
import { selectListingEditorBirthdate } from '../../../../features/listing/listingEditorSlice';
import DefaultPreview from './DefaultPreview';

const BirthdatePreview = () => {
  const birthdate = useSelector(selectListingEditorBirthdate);
  const formattedBirthdate = birthdate
    ? new Date(birthdate).toLocaleDateString('en-UK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  return <DefaultPreview text={formattedBirthdate} />;
};

export default BirthdatePreview;
