import {
  GiCat,
  GiHummingbird,
  GiRabbit,
  GiRat,
  GiSittingDog
} from 'react-icons/gi';
import BreedDropdown from '../../components/listing/biology/BreedDropdown';
import SpeciesBox from '../../components/listing/biology/SpeciesBox';
import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import ListingLayout from '../../layouts/ListingLayout';

const Biology = () => {
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
    <ListingLayout>
      <ListingStage title="Biology" subtitle="What's their breed and species?">
        {/* SPECIES */}
        <ListingSection title="Species">
          <div className="flex flex-row justify-between">
            {species.map((species, index) => (
              <SpeciesBox key={index} type={species.type} icon={species.icon} />
            ))}
          </div>
        </ListingSection>

        {/* BREED */}
        <ListingSection title="Breed">
          <BreedDropdown />
        </ListingSection>
      </ListingStage>
    </ListingLayout>
  );
};

export default Biology;
