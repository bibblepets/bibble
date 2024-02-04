import { StarIcon as StarIconOutlined } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import paw from '../../../../public/images/paw.jpeg';
import { selectCurrentBusiness } from '../../../features/business/businessSlice';

const BusinessProfileHeader = () => {
  const currentBusiness = useSelector(selectCurrentBusiness);

  return (
    <div className="flex flex-col items-center md:flex-row md:justify-between gap-8">
      <img
        className="object-cover rounded-full w-48 h-48 border"
        src={currentBusiness?.media[0]?.url || paw}
        alt="profile-pic"
      />
      <div className="flex flex-col items-end justify-center gap-6">
        <h1 className="text-5xl md:text-6xl text-gray-800 font-semibold">
          {currentBusiness?.name}
        </h1>
        <div className="flex flex-row gap-4 items-center text-xl text-gray-500 pr-4">
          <div className="flex gap-1">
            {Array(5)
              .fill(0)
              .map((_, i) =>
                i < (currentBusiness?.rating || 0) ? (
                  <StarIconSolid key={i} className="h-6 w-6 text-yellow-400" />
                ) : (
                  <StarIconOutlined
                    key={i}
                    className="h-6 w-6 text-yellow-400"
                  />
                )
              )}
          </div>
          <label>Pet Shop</label>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileHeader;
