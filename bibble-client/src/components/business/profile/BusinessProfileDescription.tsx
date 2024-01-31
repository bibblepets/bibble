import { useSelector } from 'react-redux';
import { selectCurrentBusiness } from '../../../features/business/businessSlice';

const BusinessProfileDescription = () => {
  const currentBusiness = useSelector(selectCurrentBusiness);

  return <p className="whitespace-pre-line">{currentBusiness?.description}</p>;
};
export default BusinessProfileDescription;
