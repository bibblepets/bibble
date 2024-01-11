import {
  GiCat,
  GiHummingbird,
  GiRabbit,
  GiRat,
  GiSittingDog
} from 'react-icons/gi';
import { useSelector } from 'react-redux';
import { selectListingCreatorSpecies } from '../../../../features/listing/listingCreatorSlice';
import { toTitleCase } from '../../../../utils/string';
import SpeciesBox from './SpeciesBox';
import { selectListingOptionsSpecies } from '../../../../features/listing/listingOptionsSlice';
import { IconType } from 'react-icons';

const speciesIconMap: Record<string, IconType> = {
  dog: GiSittingDog,
  cat: GiCat
};

const SpeciesOptions = ({ readOnly }: { readOnly?: boolean }) => {
  const selectedSpecies = useSelector(selectListingCreatorSpecies);
  const speciesOptions = useSelector(selectListingOptionsSpecies);

  if (readOnly) {
    return (
      <a className="text-gray-700 text-sm font-medium">
        {(selectedSpecies && toTitleCase(selectedSpecies.name)) ||
          'No species selected'}
      </a>
    );
  }

  return (
    <div className="flex flex-row justify-between">
      {speciesOptions.map((species, index) => (
        <SpeciesBox
          key={index}
          species={species}
          icon={speciesIconMap[species.name]}
        />
      ))}
    </div>
  );
};

export default SpeciesOptions;
