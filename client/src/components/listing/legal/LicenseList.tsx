import { CheckIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  addLicense,
  removeLicense,
  selectListingLicenses
} from '../../../features/listingSlice';
import { store } from '../../../store';
import { License } from '../../../features/types';
import { toCamelCase } from '../../../utils/string';

const dummyLicenses = [
  { name: 'avs license' },
  { name: 'breed allowed' },
  { name: 'hdb approved' },
  { name: 'insurance' },
  { name: 'microchipped' }
];

const LicenseList = ({ readOnly }: { readOnly?: boolean }) => {
  const licenses = dummyLicenses;
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
      {licenses.map((license, index) => (
        <div key={index} className="flex flex-row gap-4 items-center">
          <button
            onClick={() => handleClick(license)}
            disabled={readOnly}
            className="p-2 rounded-lg border transition hover:shadow-inner"
          >
            {selectedLicenses?.map((e) => e.name).includes(license.name) ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
          <a key={index} className="text-sm font-light text-gray-500">
            {toCamelCase(license.name)}
          </a>
        </div>
      ))}
    </div>
  );
};

export default LicenseList;
