import {
  GiCat,
  GiHummingbird,
  GiRabbit,
  GiRat,
  GiSittingDog
} from 'react-icons/gi';
import BirthdateSelect from '../../components/listing/biology/BirthdateSelect';
import BreedDropdown from '../../components/listing/biology/BreedDropdown';
import GenderOptions from '../../components/listing/biology/GenderOptions';
import SpeciesBox from '../../components/listing/biology/SpeciesBox';
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
      <div className="flex flex-col justify-center items-center w-full h-full overflow-auto">
        <div className="flex flex-col gap-8 w-[512px] max-h-full">
          <div className="flex flex-col gap-2">
            {/* HEADER */}
            <h1 className="font-semibold text-lg">Biology</h1>
            <p className="font-light text-gray-500">
              Tell us more about your friend.
            </p>
          </div>
          <hr />

          {/* SPECIES */}
          <div className="flex flex-row w-full justify-between">
            <h2 className="font-medium">Species</h2>

            <div className="flex flex-row gap-8">
              {species.map((species, index) => (
                <SpeciesBox
                  key={index}
                  type={species.type}
                  icon={species.icon}
                />
              ))}
            </div>
          </div>
          <hr />

          <div className="flex flex-col gap-4">
            <h2 className="font-medium">Breed</h2>
            <BreedDropdown
              breeds={breeds}
              selectedBreed="German Sheperd"
              onBreedSelected={() => {}}
            />
          </div>
          <hr />

          {/* GENDER */}
          <div className="flex flex-row w-full justify-between">
            <h2 className="font-medium">Gender</h2>
            <GenderOptions />
          </div>
          <hr />

          {/* BIRTHDATE */}
          <div className="flex flex-col gap-4">
            <h2 className="font-medium">Birthdate</h2>
            <BirthdateSelect />
          </div>
        </div>
      </div>
    </ListingLayout>
  );
};

export default Biology;
