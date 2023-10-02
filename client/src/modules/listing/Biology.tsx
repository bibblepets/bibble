import BreedDropdown from '../../components/listing/biology/BreedDropdown';
import SpeciesOptions from '../../components/listing/biology/SpeciesOptions';
import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import ListingLayout from '../../layouts/ListingLayout';

const Biology = () => {
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
