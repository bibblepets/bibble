import { CheckIcon } from '@heroicons/react/24/outline';
import { toCamelCase } from '../../../utils/string';

const dummyVaccines = [
  'avian influenza',
  'lymphocytic choriomeningitis',
  'rabies',
  'canine parvovirus',
  'bovine viral diarrhea',
  'feline immunodeficiency',
  'feline leukemia',
  'porcine herpes',
  'foot and mouth disease',
  'canine distemper'
];

const VaccinationList = () => {
  const vaccines = dummyVaccines;

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {vaccines.map((vaccine, index) => (
        <div className="flex flex-row gap-4 items-center">
          <button className="p-2 rounded-lg border">
            <CheckIcon className="w-4 h-4" />
          </button>
          <a key={index} className="text-sm font-light text-gray-500">
            {toCamelCase(vaccine)}
          </a>
        </div>
      ))}
    </div>
  );
};

export default VaccinationList;
