import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { store } from '../../../../store';
import { selectListingOptionsVaccines } from '../../../../features/listing/listingOptionsSlice';
import {
  addVaccination,
  removeVaccination,
  selectListingEditorSpecies,
  selectListingEditorVaccines
} from '../../../../features/listing/listingEditorSlice';
import { Vaccine } from '../../../../features/listing/types';

const VaccinationList = () => {
  const species = useSelector(selectListingEditorSpecies);
  const allVaccines = useSelector(selectListingOptionsVaccines);
  const vaccines = allVaccines.filter(
    (vaccine) => vaccine.speciesId === species?._id
  );
  const selectedVaccines = useSelector(selectListingEditorVaccines);

  const isSelected = (vaccine: Vaccine) =>
    selectedVaccines?.map((v) => v._id)?.includes(vaccine._id);

  const onAdd = useCallback(
    (vaccine: Vaccine) => {
      if (isSelected(vaccine)) {
        return;
      }
      store.dispatch(addVaccination(vaccine));
    },
    [store, selectedVaccines]
  );

  const onRemove = useCallback(
    (vaccine: Vaccine) => {
      store.dispatch(removeVaccination(vaccine));
    },
    [store, selectedVaccines]
  );

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {vaccines.map((vaccine, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <label>{vaccine.name}</label>
              {vaccine.isCore && (
                <p className="text-sm font-light text-gray-500">
                  Core vaccination
                </p>
              )}
            </div>

            <div className="flex flex-row gap-4">
              <button
                onClick={() => onRemove(vaccine)}
                className={`border rounded-full p-2 h-[34px] w-[34px] transition ${
                  !isSelected(vaccine) && 'bg-gray-800'
                }`}
              >
                <XMarkIcon
                  className={`w-4 h-4 text-gray-500 transition ${
                    !isSelected(vaccine) && 'text-white'
                  }`}
                />
              </button>

              <button
                onClick={() => onAdd(vaccine)}
                className={`border rounded-full p-2 h-[34px] w-[34px] transition ${
                  isSelected(vaccine) && 'bg-gray-800'
                }`}
              >
                <CheckIcon
                  className={`w-4 h-4 text-gray-500 transition ${
                    isSelected(vaccine) && 'text-white'
                  }`}
                />
              </button>
            </div>
          </div>

          {index !== vaccines.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
};

export default VaccinationList;
