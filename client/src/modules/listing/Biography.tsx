import BirthdateSelect from '../../components/listing/biography/BirthdateSelect';
import DescriptionInput from '../../components/listing/biography/DescriptionInput';
import GenderOptions from '../../components/listing/biography/GenderOptions';
import OriginDropdown from '../../components/listing/biography/OriginDropdown';
import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import ListingLayout from '../../layouts/ListingLayout';

const Biography = () => {
  return (
    <ListingLayout>
      <ListingStage
        title="Biography"
        subtitle="Tell us more about your friend..."
      >
        {/* ORIGIN */}
        <ListingSection title="Origin">
          <OriginDropdown />
        </ListingSection>

        {/* GENDER */}
        <ListingSection title="Gender">
          <GenderOptions />
        </ListingSection>

        {/* BIRTHDATE */}
        <ListingSection title="Birthdate">
          <BirthdateSelect />
        </ListingSection>

        {/* DESCRIPTION */}
        <ListingSection title="Description">
          <DescriptionInput />
        </ListingSection>
      </ListingStage>
    </ListingLayout>
  );
};

export default Biography;
