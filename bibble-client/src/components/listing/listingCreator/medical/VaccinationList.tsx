import { CheckIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  addVaccination,
  removeVaccination,
  selectListingCreatorSpecies,
  selectListingCreatorVaccines
} from '../../../../features/listing/listingCreatorSlice';
import { store } from '../../../../store';
import { Vaccine } from '../../../../types';
import { selectListingOptionsVaccines } from '../../../../features/listing/listingOptionsSlice';

const VaccinationList = ({ readOnly }: { readOnly?: boolean }) => {
  const species = useSelector(selectListingCreatorSpecies);
  const allVaccines = useSelector(selectListingOptionsVaccines);
  const vaccines = allVaccines.filter((vaccine) => vaccine.species === species);
  const selectedVaccines = useSelector(selectListingCreatorVaccines);

  const handleClick = useCallback(
    (vaccine: Vaccine) => {
      if (selectedVaccines?.map((v) => v._id)?.includes(vaccine._id)) {
        store.dispatch(removeVaccination(vaccine));
      } else {
        store.dispatch(addVaccination(vaccine));
      }
    },
    [store, selectedVaccines]
  );

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {vaccines.map((vaccine, index) => (
        <div key={index} className="flex flex-row gap-4 items-center">
          <button
            onClick={() => handleClick(vaccine)}
            disabled={readOnly}
            className="p-2 rounded-lg border transition hover:shadow-inner"
          >
            {selectedVaccines?.map((e) => e.name)?.includes(vaccine.name) ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
          <a key={index} className="text-sm font-light text-gray-500">
            {vaccine.name}
          </a>
        </div>
      ))}
    </div>
  );
};

export default VaccinationList;
