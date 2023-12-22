import BreedDropdown from '../../../components/listing/listingCreator/biology/BreedDropdown';
import SpeciesOptions from '../../../components/listing/listingCreator/biology/SpeciesOptions';
import ListingSection from '../../../components/listing/listing/ListingSection';
import ListingStage from '../../../components/listing/listing/ListingStage';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Biology = () => {
  return (
    <ListingCreatorLayout>
      <ListingStage title="Biology" subtitle="Now, who do we have here?">
        {/* SPECIES */}
        <ListingSection title="Species" field="species">
          <SpeciesOptions />
        </ListingSection>

        {/* BREED */}
        <ListingSection title="Breed" field="breed">
          <BreedDropdown />
        </ListingSection>
      </ListingStage>
    </ListingCreatorLayout>
  );
};

export default Biology;
