import BreedDropdown from '../../../components/listing/listingCreator/biology/BreedDropdown';
import SpeciesOptions from '../../../components/listing/listingCreator/biology/SpeciesOptions';
import ListingCreatorSection from '../../../components/listing/listingCreator/ListingCreatorSection';
import ListingCreatorStage from '../../../components/listing/listingCreator/ListingCreatorStage';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Biology = () => {
  return (
    <ListingCreatorLayout>
      <ListingCreatorStage title="Biology" subtitle="Now, who do we have here?">
        {/* SPECIES */}
        <ListingCreatorSection title="Species" field="species">
          <SpeciesOptions />
        </ListingCreatorSection>

        {/* BREED */}
        <ListingCreatorSection title="Breed" field="breed">
          <BreedDropdown />
        </ListingCreatorSection>
      </ListingCreatorStage>
    </ListingCreatorLayout>
  );
};

export default Biology;
