import {
  GiCat,
  GiHummingbird,
  GiRabbit,
  GiRat,
  GiSittingDog
} from 'react-icons/gi';
import SpeciesBox from './SpeciesBox';

const SpeciesOptions = () => {
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

  return (
    <div className="flex flex-row justify-between">
      {species.map((species, index) => (
        <SpeciesBox key={index} species={species.type} icon={species.icon} />
      ))}
    </div>
  );
};

export default SpeciesOptions;
