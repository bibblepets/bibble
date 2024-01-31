import { useSelector } from 'react-redux';
import { selectCurrentBusiness } from '../../../features/business/businessSlice';

const BusinessProfileMedia = () => {
  const currentBusiness = useSelector(selectCurrentBusiness);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {currentBusiness?.media.map((medium, index) => (
        <div
          key={index}
          className="relative aspect-[4/3] cursor-pointer transition hover:scale-105"
        >
          <img
            className="object-cover object-center h-full w-full rounded-lg"
            src={medium.url}
            onClick={() => window.open(medium.url, '_blank')}
          />
        </div>
      ))}
    </div>
  );
};

export default BusinessProfileMedia;
