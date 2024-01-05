import ListingCreatorSection from '../../../components/listing/listingCreator/ListingCreatorSection';
import ListingCreatorStage from '../../../components/listing/listingCreator/ListingCreatorStage';
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
      <ListingCreatorStage
        title="Summary"
        subtitle="Double check all their details..."
      >
        <ListingCreatorSection title="Species" field="species">
          <SpeciesOptions readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Breed" field="breed">
          <BreedDropdown readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Origin" field="origin">
          <OriginDropdown readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Gender" field="gender">
          <GenderOptions readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Name" field="name">
          <NameInput readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Birthdate" field="birthdate">
          <BirthdateSelect readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Description" field="description">
          <DescriptionInput readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Size" field="size">
          <SizeOptions readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Weight" field="weight">
          <WeightInput readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Hair Coat" field="hairCoat">
          <HairCoatSelect readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Vaccinations" field="vaccines">
          <VaccinationList readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection
          title="AVS License Number"
          field="avsLicenseNumber"
        >
          <AvsLicenseInput readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Legal Tags" field="legalTags">
          <LegalTagList readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Media" field="media">
          <MediaUpload readOnly />
        </ListingCreatorSection>

        <ListingCreatorSection title="Price" field="price">
          <PriceInput readOnly />
        </ListingCreatorSection>
      </ListingCreatorStage>
    </ListingCreatorLayout>
  );
};

export default Summary;
