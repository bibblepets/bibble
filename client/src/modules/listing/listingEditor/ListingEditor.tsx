import ListingSection from '../../../components/listing/listing/ListingSection';
import ListingStage from '../../../components/listing/listing/ListingStage';
import BirthdateSelect from '../../../components/listing/listingEditor/biography/BirthdateSelect';
import DescriptionInput from '../../../components/listing/listingEditor/biography/DescriptionInput';
import GenderOptions from '../../../components/listing/listingEditor/biography/GenderOptions';
import NameInput from '../../../components/listing/listingEditor/biography/NameInput';
import OriginDropdown from '../../../components/listing/listingEditor/biography/OriginDropdown';
import BreedDropdown from '../../../components/listing/listingEditor/biology/BreedDropdown';
import SpeciesOptions from '../../../components/listing/listingEditor/biology/SpeciesOptions';
import AvsLicenseInput from '../../../components/listing/listingEditor/legal/AvsLicenseInput';
import LegalTagList from '../../../components/listing/listingEditor/legal/LegalTagList';
import MediaUpload from '../../../components/listing/listingEditor/media/MediaUpload';
import HairCoatSelect from '../../../components/listing/listingEditor/medical/HairCoatSelect';
import SizeOptions from '../../../components/listing/listingEditor/medical/SizeOptions';
import VaccinationList from '../../../components/listing/listingEditor/medical/VaccinationList';
import WeightInput from '../../../components/listing/listingEditor/medical/WeightInput';
import PriceInput from '../../../components/listing/listingEditor/price/PriceInput';
import ListingEditorLayout from '../../../layouts/ListingEditorLayout';

const ListingEditor = () => {
  return (
    <ListingEditorLayout>
      <ListingStage title="Edit Listing" subtitle="Making any changes?">
        <ListingSection title="Species" field="species">
          <SpeciesOptions />
        </ListingSection>

        <ListingSection title="Breed" field="breed">
          <BreedDropdown />
        </ListingSection>

        <ListingSection title="Origin" field="origin">
          <OriginDropdown />
        </ListingSection>

        <ListingSection title="Gender" field="gender">
          <GenderOptions />
        </ListingSection>

        <ListingSection title="Name" field="name">
          <NameInput />
        </ListingSection>

        <ListingSection title="Birthdate" field="birthdate">
          <BirthdateSelect />
        </ListingSection>

        <ListingSection title="Description" field="description">
          <DescriptionInput />
        </ListingSection>

        <ListingSection title="Size" field="size">
          <SizeOptions />
        </ListingSection>

        <ListingSection title="Weight" field="weight">
          <WeightInput />
        </ListingSection>

        <ListingSection title="Hair Coat" field="hairCoat">
          <HairCoatSelect />
        </ListingSection>

        <ListingSection title="Vaccinations" field="vaccines">
          <VaccinationList />
        </ListingSection>

        <ListingSection title="AVS License Number" field="avsLicenseNumber">
          <AvsLicenseInput />
        </ListingSection>

        {/* TODO TITUS */}
        <ListingSection title="Legal Tags" field="legalTags">
          <LegalTagList readOnly />
        </ListingSection>

        <ListingSection title="Media" field="media">
          <MediaUpload />
        </ListingSection>

        <ListingSection title="Price" field="price">
          <PriceInput />
        </ListingSection>
      </ListingStage>
    </ListingEditorLayout>
  );
};

export default ListingEditor;
