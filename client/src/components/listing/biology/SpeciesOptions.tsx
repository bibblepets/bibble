import {
  GiCat,
  GiHummingbird,
  GiRabbit,
  GiRat,
  GiSittingDog
} from 'react-icons/gi';
import { useSelector } from 'react-redux';
import { selectListingSpecies } from '../../../features/listingSlice';
import { toCamelCase } from '../../../utils/string';
import SpeciesBox from './SpeciesBox';

const SpeciesOptions = ({ readOnly }: { readOnly?: boolean }) => {
  const species = [
    {
      type: 'dog',
      icon: GiSittingDog
    },
    {
      type: 'cat',
      icon: GiCat,
      disabled: true
    },
    {
      type: 'rabbit',
      icon: GiRabbit,
      disabled: true
    },
    {
      type: 'mouse',
      icon: GiRat,
      disabled: true
    },
    {
      type: 'bird',
      icon: GiHummingbird,
      disabled: true
    }
  ];

  const selectedSpecies = useSelector(selectListingSpecies);

  if (readOnly) {
    return (
      <a className="text-gray-700 text-sm font-medium">
        {(selectedSpecies && toCamelCase(selectedSpecies)) ||
          'No species selected'}
      </a>
    );
  }

  return (
    <div className="flex flex-row justify-between">
      {species.map((species, index) => (
        <SpeciesBox
          key={index}
          species={species.type}
          icon={species.icon}
          disabled={species.disabled}
        />
      ))}
    </div>
  );
};

export default SpeciesOptions;
