import BirthdateSelect from '../../../components/listing/listingCreator/biography/BirthdateSelect';
import DescriptionInput from '../../../components/listing/listingCreator/biography/DescriptionInput';
import GenderOptions from '../../../components/listing/listingCreator/biography/GenderOptions';
import NameInput from '../../../components/listing/listingCreator/biography/NameInput';
import OriginDropdown from '../../../components/listing/listingCreator/biography/OriginDropdown';
import ListingSection from '../../../components/listing/listing/ListingSection';
import ListingStage from '../../../components/listing/listing/ListingStage';
import ListingLayout from '../../../layouts/ListingLayout';

const Biography = () => {
  return (
    <ListingLayout>
      <ListingStage
        title="Biography"
        subtitle="Everyone's got a story to tell."
      >
        {/* NAME */}
        <ListingSection title="Name" field="name" optional>
          <NameInput />
        </ListingSection>

        {/* ORIGIN */}
        <ListingSection title="Origin" field="origin">
          <OriginDropdown />
        </ListingSection>

        {/* GENDER */}
        <ListingSection title="Gender" field="gender">
          <GenderOptions />
        </ListingSection>

        {/* BIRTHDATE */}
        <ListingSection title="Birthdate" field="birthdate">
          <BirthdateSelect />
        </ListingSection>

        {/* DESCRIPTION */}
        <ListingSection title="Description" field="description">
          <DescriptionInput />
        </ListingSection>
      </ListingStage>
    </ListingLayout>
  );
};

export default Biography;
