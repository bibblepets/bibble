import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import VaccinationList from '../../components/listing/medical/VaccinationList';
import WeightInput from '../../components/listing/medical/WeightInput';
import ListingLayout from '../../layouts/ListingLayout';

const Medical = () => {
  return (
    <ListingLayout>
      <ListingStage title="Medical" subtitle="We need their medical details...">
        {/* WEIGHT */}
        <ListingSection title="Weight">
          <WeightInput />
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
