import BirthdateSelect from '../../components/listing/biography/BirthdateSelect';
import DescriptionInput from '../../components/listing/biography/DescriptionInput';
import GenderOptions from '../../components/listing/biography/GenderOptions';
import OriginDropdown from '../../components/listing/biography/OriginDropdown';
import BreedDropdown from '../../components/listing/biology/BreedDropdown';
import SpeciesOptions from '../../components/listing/biology/SpeciesOptions';
import LicenseList from '../../components/listing/legal/LicenseList';
import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import MediaUpload from '../../components/listing/media/MediaUpload';
import VaccinationList from '../../components/listing/medical/VaccinationList';
import WeightInput from '../../components/listing/medical/WeightInput';
import PriceInput from '../../components/listing/price/PriceInput';
import ListingLayout from '../../layouts/ListingLayout';

const Summary = () => {
  return (
    <ListingLayout>
      <ListingStage
        title="Summary"
        subtitle="Double check all their details..."
      >
        <ListingSection title="Species">
          <SpeciesOptions readOnly />
        </ListingSection>

        <ListingSection title="Breed">
          <BreedDropdown readOnly />
        </ListingSection>

        <ListingSection title="Origin">
          <OriginDropdown readOnly />
        </ListingSection>

        <ListingSection title="Gender">
          <GenderOptions readOnly />
        </ListingSection>

        <ListingSection title="Birthdate">
          <BirthdateSelect readOnly />
        </ListingSection>

        <ListingSection title="Description">
          <DescriptionInput readOnly />
        </ListingSection>

        <ListingSection title="Weight">
          <WeightInput readOnly />
        </ListingSection>

        <ListingSection title="Vaccinations">
          <VaccinationList readOnly />
        </ListingSection>

        <ListingSection title="Licenses">
          <LicenseList readOnly />
        </ListingSection>

        <ListingSection title="Media">
          <MediaUpload readOnly />
        </ListingSection>

        <ListingSection title="Price">
          <PriceInput readOnly />
        </ListingSection>
      </ListingStage>
    </ListingLayout>
  );
};

export default Summary;
