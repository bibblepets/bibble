import { useSelector } from 'react-redux';
import { toCamelCase } from '../../../../utils/string';
import { selectListingEditorSpecies } from '../../../../features/listing/listingEditorSlice';

const SpeciesOptions = () => {
  const selectedSpecies = useSelector(selectListingEditorSpecies);

  return (
    <a className="text-gray-700 text-sm font-medium">
      {(selectedSpecies && toCamelCase(selectedSpecies)) ||
        'No species selected'}
    </a>
  );
};

export default SpeciesOptions;
