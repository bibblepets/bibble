import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentBusiness } from '../../features/business/businessSlice';
import BusinessLayout from '../../layouts/BusinessLayout';

const BusinessDashbaord = () => {
  const currentBusiness = useSelector(selectCurrentBusiness);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentBusiness?.media.length === 0) {
      navigate('/business/register');
    } else if (!currentBusiness) {
      navigate('/business/login');
    }
  }, [currentBusiness]);

  return (
    <BusinessLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold">Business Dashboard</h1>
      </div>
    </BusinessLayout>
  );
};

export default BusinessDashbaord;
