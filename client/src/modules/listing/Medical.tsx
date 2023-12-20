import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import HairCoatSelect from '../../components/listing/medical/HairCoatSelect';
import SizeOptions from '../../components/listing/medical/SizeOptions';
import VaccinationList from '../../components/listing/medical/VaccinationList';
import WeightInput from '../../components/listing/medical/WeightInput';
import ListingLayout from '../../layouts/ListingLayout';

const Medical = () => {
  return (
    <ListingLayout>
      <ListingStage title="Medical" subtitle="We need their medical details...">
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
    </ListingLayout>
  );
};

export default Medical;
