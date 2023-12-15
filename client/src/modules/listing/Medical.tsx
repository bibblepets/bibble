import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import HairCoatInput from '../../components/listing/medical/HairCoatInput';
import SizeOptions from '../../components/listing/medical/SizeOptions';
import VaccinationList from '../../components/listing/medical/VaccinationList';
import WeightInput from '../../components/listing/medical/WeightInput';
import ListingLayout from '../../layouts/ListingLayout';

const Medical = () => {
  return (
    <ListingLayout>
      <ListingStage title="Medical" subtitle="We need their medical details...">
        {/* SIZE */}
        <ListingSection title="Size">
          <SizeOptions />
        </ListingSection>

        {/* WEIGHT */}
        <ListingSection title="Weight">
          <WeightInput />
        </ListingSection>

        {/* HAIR COAT */}
        <ListingSection title="Hair Coat">
          <HairCoatInput />
        </ListingSection>

        {/* VACCINATIONS */}
        <ListingSection title="Vaccinations">
          <VaccinationList />
        </ListingSection>
      </ListingStage>
    </ListingLayout>
  );
};

export default Medical;
