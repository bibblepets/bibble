import ListingCreatorSection from '../../../components/listing/listingCreator/ListingCreatorSection';
import ListingCreatorStage from '../../../components/listing/listingCreator/ListingCreatorStage';
import HairCoatSelect from '../../../components/listing/listingCreator/medical/HairCoatSelect';
import SizeOptions from '../../../components/listing/listingCreator/medical/SizeOptions';
import VaccinationList from '../../../components/listing/listingCreator/medical/VaccinationList';
import WeightInput from '../../../components/listing/listingCreator/medical/WeightInput';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Medical = () => {
  return (
    <ListingCreatorLayout>
      <ListingCreatorStage
        title="Medical"
        subtitle="Don't worry, no needles here."
      >
        {/* SIZE */}
        <ListingCreatorSection title="Size" field="size">
          <SizeOptions />
        </ListingCreatorSection>

        {/* WEIGHT */}
        <ListingCreatorSection title="Weight" field="weight">
          <WeightInput />
        </ListingCreatorSection>

        {/* HAIR COAT */}
        <ListingCreatorSection title="Hair Coat" field="hairCoat">
          <HairCoatSelect />
        </ListingCreatorSection>

        {/* VACCINATIONS */}
        <ListingCreatorSection title="Vaccinations" field="vaccines">
          <VaccinationList />
        </ListingCreatorSection>
      </ListingCreatorStage>
    </ListingCreatorLayout>
  );
};

export default Medical;
