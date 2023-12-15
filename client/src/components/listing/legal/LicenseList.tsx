import { CheckIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  addLicense,
  removeLicense,
  selectListingLicenses
} from '../../../features/listingSlice';
import { store } from '../../../store';
import { License } from '../../../types';

const licenses: Record<License, string> = {
  isHypoallergenic: 'Hypoallergenic',
  isNeutered: 'Neutered',
  isMicrochipped: 'Microchipped',
  isHdbApproved: 'HDB Approved'
};

const LicenseList = ({ readOnly }: { readOnly?: boolean }) => {
  const selectedLicenses = useSelector(selectListingLicenses);

  const handleClick = useCallback(
    (license: License) => {
      if (selectedLicenses?.includes(license)) {
        store.dispatch(removeLicense(license));
      } else {
        store.dispatch(addLicense(license));
      }
    },
    [store, selectedLicenses]
  );

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {Object.entries(licenses).map(([type, label], index) => (
        <div key={index} className="flex flex-row gap-4 items-center">
          <button
            onClick={() => handleClick(type as License)}
            disabled={readOnly}
            className="p-2 rounded-lg border transition hover:shadow-inner"
          >
            {selectedLicenses?.includes(type as License) ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
          <a key={index} className="text-sm font-light text-gray-500">
            {label}
          </a>
        </div>
      ))}
    </div>
  );
};

export default LicenseList;
