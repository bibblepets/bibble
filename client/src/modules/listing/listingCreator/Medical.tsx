import ListingSection from '../../../components/listing/listing/ListingSection';
import ListingStage from '../../../components/listing/listing/ListingStage';
import HairCoatSelect from '../../../components/listing/listingCreator/medical/HairCoatSelect';
import SizeOptions from '../../../components/listing/listingCreator/medical/SizeOptions';
import VaccinationList from '../../../components/listing/listingCreator/medical/VaccinationList';
import WeightInput from '../../../components/listing/listingCreator/medical/WeightInput';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Medical = () => {
  return (
    <ListingCreatorLayout>
      <ListingStage title="Medical" subtitle="Don't worry, no needles here.">
        {/* SIZE */}
        <ListingSection title="Size" field="size">
          <SizeOptions />
        </ListingSection>

        {/* WEIGHT */}
        <ListingSection title="Weight" field="weight">
          <WeightInput />
        </ListingSection>

        {/* HAIR COAT */}
        <ListingSection title="Hair Coat" field="hairCoat">
          <HairCoatSelect />
        </ListingSection>

        {/* VACCINATIONS */}
        <ListingSection title="Vaccinations" field="vaccines">
          <VaccinationList />
        </ListingSection>
      </ListingStage>
    </ListingCreatorLayout>
  );
};

export default Medical;
