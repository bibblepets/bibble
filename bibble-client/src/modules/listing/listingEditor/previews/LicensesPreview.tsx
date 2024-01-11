import { useSelector } from 'react-redux';
import DefaultPreview from './DefaultPreview';
import {
  selectListingEditorAvsLicenseNumber,
  selectListingEditorLegalTags
} from '../../../../features/listing/listingEditorSlice';
import { CheckIcon } from '@heroicons/react/24/outline';

const LicensesPreview = () => {
  const avsLicenseNumber = useSelector(selectListingEditorAvsLicenseNumber);
  const legalTags = useSelector(selectListingEditorLegalTags);

  return (
    <div>
      <DefaultPreview text={`License No. ${avsLicenseNumber}`} />
      <div className="flex flex-col gap-2 pt-2">
        {legalTags?.slice(0, 5).map((tag, index) => (
          <div key={index} className="flex flex-row items-center gap-2">
            <CheckIcon className="w-4 h-4 text-gray-500" strokeWidth={4} />
            <p className="font-light text-gray-800 overflow-ellipsis whitespace-nowrap">
              {tag.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LicensesPreview;
