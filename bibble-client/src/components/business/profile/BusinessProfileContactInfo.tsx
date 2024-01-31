import { BiGlobe, BiLogoFacebook, BiLogoInstagram } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { selectCurrentBusiness } from '../../../features/business/businessSlice';

const BusinessProfileContactInfo = () => {
  const currentBusiness = useSelector(selectCurrentBusiness);

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col gap-4">
        <label className="flex flex-row gap-8">
          <span className="text-gray-500 w-48">Email</span>
          <span className="text-gray-800">{currentBusiness?.email}</span>
        </label>
        <label className="flex flex-row gap-8">
          <span className="text-gray-500 w-48">Contact number</span>
          <span className="text-gray-800">
            {currentBusiness?.contactNumber}
          </span>
        </label>
        <label className="flex flex-row gap-8">
          <span className="text-gray-500 w-48">Location</span>
          <span className="text-gray-800">
            {currentBusiness?.address.country}
          </span>
        </label>
      </div>
      <div className="flex flex-col gap-4">
        {currentBusiness?.instagramLink && (
          <a href={currentBusiness.instagramLink} className="text-gray-800">
            <BiLogoInstagram className="text-2xl text-gray-800" />
          </a>
        )}
        {currentBusiness?.facebookLink && (
          <a href={currentBusiness.facebookLink} className="text-gray-800">
            <BiLogoFacebook className="text-2xl text-gray-800" />
          </a>
        )}
        {currentBusiness?.websiteLink && (
          <a href={currentBusiness.websiteLink} className="text-gray-800">
            <BiGlobe className="text-2xl text-gray-800" />
          </a>
        )}
      </div>
    </div>
  );
};

export default BusinessProfileContactInfo;
