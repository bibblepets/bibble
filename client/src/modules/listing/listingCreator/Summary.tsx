import ListingSection from '../../../components/listing/listing/ListingSection';
import ListingStage from '../../../components/listing/listing/ListingStage';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';
import BirthdateSelect from '../../../components/listing/listingCreator/biography/BirthdateSelect';
import DescriptionInput from '../../../components/listing/listingCreator/biography/DescriptionInput';
import GenderOptions from '../../../components/listing/listingCreator/biography/GenderOptions';
import NameInput from '../../../components/listing/listingCreator/biography/NameInput';
import OriginDropdown from '../../../components/listing/listingCreator/biography/OriginDropdown';
import BreedDropdown from '../../../components/listing/listingCreator/biology/BreedDropdown';
import SpeciesOptions from '../../../components/listing/listingCreator/biology/SpeciesOptions';
import AvsLicenseInput from '../../../components/listing/listingCreator/legal/AvsLicenseInput';
import LegalTagList from '../../../components/listing/listingCreator/legal/LegalTagList';
import MediaUpload from '../../../components/listing/listingCreator/media/MediaUpload';
import HairCoatSelect from '../../../components/listing/listingCreator/medical/HairCoatSelect';
import SizeOptions from '../../../components/listing/listingCreator/medical/SizeOptions';
import VaccinationList from '../../../components/listing/listingCreator/medical/VaccinationList';
import WeightInput from '../../../components/listing/listingCreator/medical/WeightInput';
import PriceInput from '../../../components/listing/listingCreator/price/PriceInput';

const Summary = () => {
  return (
    <ListingCreatorLayout>
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

        <ListingSection title="Name" field="name">
          <NameInput readOnly />
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
    </ListingCreatorLayout>
  );
};

export default Summary;
