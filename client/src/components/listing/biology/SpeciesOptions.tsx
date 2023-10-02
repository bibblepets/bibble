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

  return (
    <div className="flex flex-row justify-between">
      {species.map((species, index) => (
        <SpeciesBox key={index} type={species.type} icon={species.icon} />
      ))}
    </div>
  );
};

export default SpeciesOptions;
