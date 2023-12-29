import { useSelector } from 'react-redux';
import { selectListingEditorVaccines } from '../../../../features/listingEditorSlice';
import { selectListingOptionsCoreVaccines } from '../../../../features/listingOptionsSlice';
import { PlusIcon } from '@heroicons/react/24/outline';

const VaccinationsPreview = () => {
  const vaccines = useSelector(selectListingEditorVaccines);
  const coreVaccines = useSelector(selectListingOptionsCoreVaccines);

  return (
    <div className="flex flex-col gap-2 pt-2">
      {coreVaccines?.map((vaccine, index) => (
        <div key={index} className="flex flex-row items-center gap-2">
          <PlusIcon className="w-5 h-5 text-rose-500" strokeWidth={4} />
          <p className="font-light text-gray-800 overflow-ellipsis whitespace-nowrap">
            {vaccine.name}{' '}
            {vaccines?.map((v) => v._id)?.includes(vaccine._id)
              ? 'Taken'
              : 'Not Taken'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default VaccinationsPreview;
