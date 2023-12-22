import { useSelector } from 'react-redux';
import { selectListingEditorBreeds } from '../../../../features/listingEditorSlice';

const BreedDropdown = () => {
  const selectedBreeds = useSelector(selectListingEditorBreeds);

  return (
    <a className="text-sm font-medium text-gray-700">{`${
      selectedBreeds?.map((breed) => breed.name).join(', ') ||
      'No breed selected'
    }`}</a>
  );
};

export default BreedDropdown;
