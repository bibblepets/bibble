import BreedDropdown from '../../components/listing/biology/BreedDropdown';
import SpeciesOptions from '../../components/listing/biology/SpeciesOptions';
import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import ListingLayout from '../../layouts/ListingLayout';

const dummySpecies = [
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

const dummyBreeds = [
  'Labrador Retriever',
  'German Shepherd',
  'Golden Retriever',
  'French Bulldog',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Rottweiler',
  'Yorkshire Terrier',
  'Boxer',
  'Labrador Retriever',
  'German Shepherd',
  'Golden Retriever',
  'French Bulldog',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Rottweiler',
  'Yorkshire Terrier',
  'Boxer'
];
const Biology = () => {
  const species = dummySpecies;
  const breeds = dummyBreeds;

  return (
    <ListingLayout>
      <ListingStage title="Biology" subtitle="What's their breed and species?">
        {/* SPECIES */}
        <ListingSection title="Species">
          <SpeciesOptions />
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
