import BirthdateSelect from '../../components/listing/biography/BirthdateSelect';
import DescriptionInput from '../../components/listing/biography/DescriptionInput';
import GenderOptions from '../../components/listing/biography/GenderOptions';
import OriginDropdown from '../../components/listing/biography/OriginDropdown';
import BreedDropdown from '../../components/listing/biology/BreedDropdown';
import SpeciesOptions from '../../components/listing/biology/SpeciesOptions';
import AvsLicenseInput from '../../components/listing/legal/AvsLicenseInput';
import LegalTagList from '../../components/listing/legal/LegalTagList';
import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import MediaUpload from '../../components/listing/media/MediaUpload';
import HairCoatSelect from '../../components/listing/medical/HairCoatSelect';
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
        <ListingSection title="Species" field="species">
          <SpeciesOptions readOnly />
        </ListingSection>

        <ListingSection title="Breed" field="breed">
          <BreedDropdown readOnly />
        </ListingSection>

        <ListingSection title="Origin" field="origin">
          <OriginDropdown readOnly />
        </ListingSection>

        <ListingSection title="Gender" field="gender">
          <GenderOptions readOnly />
        </ListingSection>

        <ListingSection title="Birthdate" field="birthdate">
          <BirthdateSelect readOnly />
        </ListingSection>

        <ListingSection title="Description" field="description">
          <DescriptionInput readOnly />
        </ListingSection>

        <ListingSection title="Size" field="size">
          <SizeOptions readOnly />
        </ListingSection>

        <ListingSection title="Weight" field="weight">
          <WeightInput readOnly />
        </ListingSection>

        <ListingSection title="Hair Coat" field="hairCoat">
          <HairCoatSelect readOnly />
        </ListingSection>

        <ListingSection title="Vaccinations" field="vaccines">
          <VaccinationList readOnly />
        </ListingSection>

        <ListingSection title="AVS License Number" field="avsLicenseNumber">
          <AvsLicenseInput readOnly />
        </ListingSection>

        <ListingSection title="Legal Tags" field="legalTags">
          <LegalTagList readOnly />
        </ListingSection>

        <ListingSection title="Media" field="media">
          <MediaUpload readOnly />
        </ListingSection>

        <ListingSection title="Price" field="price">
          <PriceInput readOnly />
        </ListingSection>
      </ListingStage>
    </ListingLayout>
  );
};

export default Summary;
