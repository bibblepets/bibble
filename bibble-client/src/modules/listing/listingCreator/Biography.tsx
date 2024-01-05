import BirthdateSelect from '../../../components/listing/listingCreator/biography/BirthdateSelect';
import DescriptionInput from '../../../components/listing/listingCreator/biography/DescriptionInput';
import GenderOptions from '../../../components/listing/listingCreator/biography/GenderOptions';
import NameInput from '../../../components/listing/listingCreator/biography/NameInput';
import OriginDropdown from '../../../components/listing/listingCreator/biography/OriginDropdown';
import ListingCreatorSection from '../../../components/listing/listingCreator/ListingCreatorSection';
import ListingCreatorStage from '../../../components/listing/listingCreator/ListingCreatorStage';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Biography = () => {
  return (
    <ListingCreatorLayout>
      <ListingCreatorStage
        title="Biography"
        subtitle="Everyone's got a story to tell."
      >
        {/* NAME */}
        <ListingCreatorSection title="Name" field="name" optional>
          <NameInput />
        </ListingCreatorSection>

        {/* ORIGIN */}
        <ListingCreatorSection title="Origin" field="origin">
          <OriginDropdown />
        </ListingCreatorSection>

        {/* GENDER */}
        <ListingCreatorSection title="Gender" field="gender">
          <GenderOptions />
        </ListingCreatorSection>

        {/* BIRTHDATE */}
        <ListingCreatorSection title="Birthdate" field="birthdate">
          <BirthdateSelect />
        </ListingCreatorSection>

        {/* DESCRIPTION */}
        <ListingCreatorSection title="Description" field="description">
          <DescriptionInput />
        </ListingCreatorSection>
      </ListingCreatorStage>
    </ListingCreatorLayout>
  );
};

export default Biography;
