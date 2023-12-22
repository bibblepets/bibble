import ListingSection from '../../../components/listing/listing/ListingSection';
import SpeciesOptions from '../../../components/listing/listingEditor/biology/SpeciesOptions';
import BreedDropdown from '../../../components/listing/listingEditor/biology/BreedDropdown';
import OriginDropdown from '../../../components/listing/listingEditor/biography/OriginDropdown';
import GenderOptions from '../../../components/listing/listingEditor/biography/GenderOptions';
import NameInput from '../../../components/listing/listingEditor/biography/NameInput';
import BirthdateSelect from '../../../components/listing/listingEditor/biography/BirthdateSelect';
import DescriptionInput from '../../../components/listing/listingEditor/biography/DescriptionInput';
import SizeOptions from '../../../components/listing/listingEditor/medical/SizeOptions';
import WeightInput from '../../../components/listing/listingEditor/medical/WeightInput';
import HairCoatSelect from '../../../components/listing/listingEditor/medical/HairCoatSelect';
import VaccinationList from '../../../components/listing/listingEditor/medical/VaccinationList';
import AvsLicenseInput from '../../../components/listing/listingEditor/legal/AvsLicenseInput';
import LegalTagList from '../../../components/listing/listingEditor/legal/LegalTagList';
import MediaUpload from '../../../components/listing/listingEditor/media/MediaUpload';
import PriceInput from '../../../components/listing/listingEditor/price/PriceInput';

const ListingEditorPanel = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full overflow-auto my-12">
      <div className="flex flex-col w-full sm:w-[640px] px-8 max-h-full gap-10">
        <div className="flex flex-col gap-2 items-end">
          <div className="flex gap-2 justify-between items-center">
            <h2 className={`font-semibold text-2xl`}>Editor</h2>
          </div>
          <p className="font-light text-gray-500">Made any changes?</p>
        </div>
        <hr className="mx-8 bg-sky-300" />

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
      </div>
    </div>
  );
};

export default ListingEditorPanel;
