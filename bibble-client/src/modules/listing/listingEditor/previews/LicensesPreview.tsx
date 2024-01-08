import { useSelector } from 'react-redux';
import DefaultPreview from './DefaultPreview';
import { selectListingEditorAvsLicenseNumber } from '../../../../features/listing/listingEditorSlice';

const LicensesPreview = () => {
  const avsLicenseNumber = useSelector(selectListingEditorAvsLicenseNumber);

  return <DefaultPreview text={avsLicenseNumber} />;
};

export default LicensesPreview;
