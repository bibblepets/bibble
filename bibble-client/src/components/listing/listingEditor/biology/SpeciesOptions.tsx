import { useSelector } from 'react-redux';
import { toTitleCase } from '../../../../utils/string';
import { selectListingEditorSpecies } from '../../../../features/listing/listingEditorSlice';

const SpeciesOptions = () => {
  const selectedSpecies = useSelector(selectListingEditorSpecies);

  return (
    <a className="text-gray-700 text-sm font-medium">
      {(selectedSpecies && toTitleCase(selectedSpecies.name)) ||
        'No species selected'}
    </a>
  );
};

export default SpeciesOptions;
