import BirthdateSelect from '../../components/listing/biography/BirthdateSelect';
import DescriptionInput from '../../components/listing/biography/DescriptionInput';
import GenderOptions from '../../components/listing/biography/GenderOptions';
import OriginDropdown from '../../components/listing/biography/OriginDropdown';
import BreedDropdown from '../../components/listing/biology/BreedDropdown';
import SpeciesOptions from '../../components/listing/biology/SpeciesOptions';
import AvsLicenseInput from '../../components/listing/legal/AvsLicenseInput';
import LicenseList from '../../components/listing/legal/LicenseList';
import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import MediaUpload from '../../components/listing/media/MediaUpload';
import HairCoatInput from '../../components/listing/medical/HairCoatInput';
import SizeOptions from '../../components/listing/medical/SizeOptions';
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

        <ListingSection title="Size">
          <SizeOptions readOnly />
        </ListingSection>

        <ListingSection title="Weight">
          <WeightInput readOnly />
        </ListingSection>

        <ListingSection title="Hair Coat">
          <HairCoatInput readOnly />
        </ListingSection>

        <ListingSection title="Vaccinations">
          <VaccinationList readOnly />
        </ListingSection>

        <ListingSection title="AVS License Number">
          <AvsLicenseInput readOnly />
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
