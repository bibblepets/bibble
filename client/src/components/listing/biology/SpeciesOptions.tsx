import {
  GiCat,
  GiHummingbird,
  GiRabbit,
  GiRat,
  GiSittingDog
} from 'react-icons/gi';
import { useSelector } from 'react-redux';
import { selectListingSpecies } from '../../../features/listingSlice';
import SpeciesBox from './SpeciesBox';

const SpeciesOptions = ({ readOnly }: { readOnly?: boolean }) => {
  const species = [
    {
      type: {
        name: 'dog'
      },
      icon: GiSittingDog
    },
    {
      type: {
        name: 'cat'
      },
      icon: GiCat
    },
    {
      type: {
        name: 'rabbit'
      },
      icon: GiRabbit
    },
    {
      type: {
        name: 'mouse'
      },
      icon: GiRat
    },
    {
      type: {
        name: 'bird'
      },
      icon: GiHummingbird
    }
  ];

  const selectedSpecies = useSelector(selectListingSpecies);

  if (readOnly) {
    return (
      <div className="flex flex-row justify-center">
        {selectedSpecies && (
          <SpeciesBox
            species={selectedSpecies}
            icon={
              species.find((s) => s.type.name === selectedSpecies.name)!.icon
            }
          />
        )}
      </div>
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
