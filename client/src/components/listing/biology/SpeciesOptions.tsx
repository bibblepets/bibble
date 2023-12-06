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
      icon: GiCat
    },
    {
      type: 'rabbit',
      icon: GiRabbit
    },
    {
      type: 'mouse',
      icon: GiRat
    },
    {
      type: 'bird',
      icon: GiHummingbird
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
        <SpeciesBox key={index} species={species.type} icon={species.icon} />
      ))}
    </div>
  );
};

export default SpeciesOptions;
