import { CheckIcon } from '@heroicons/react/24/outline';
import { toCamelCase } from '../../../utils/string';

const dummyLicenses = [
  'avs license',
  'breed allowed',
  'hdb approved',
  'insurance',
  'microchipped'
];

const LicenseList = () => {
  const licenses = dummyLicenses;

  return (
    <div className="grid grid-cols-3 gap-8">
      {licenses.map((license, index) => (
        <div className="flex flex-row gap-4 items-center">
          <button className="p-2 rounded-lg border">
            <CheckIcon className="w-4 h-4" />
          </button>
          <a key={index} className="text-sm font-light text-gray-500">
            {toCamelCase(license)}
          </a>
        </div>
      ))}
    </div>
  );
};

export default LicenseList;
