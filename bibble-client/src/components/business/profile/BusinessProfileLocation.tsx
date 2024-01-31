import { useSelector } from 'react-redux';
import { selectCurrentBusiness } from '../../../features/business/businessSlice';
import { toAddressString } from '../../../utils/string';
import MapCard from '../../kennel/details/MapCard';

const BusinessProfileLocation = () => {
  const currentBusiness = useSelector(selectCurrentBusiness);
  return (
    <MapCard
      location={toAddressString(currentBusiness?.address)}
      height={800}
    />
  );
};

export default BusinessProfileLocation;
