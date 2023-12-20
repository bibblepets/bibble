import AvsLicenseInput from '../../components/listing/legal/AvsLicenseInput';
import LegalTagList from '../../components/listing/legal/LegalTagList';
import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import ListingLayout from '../../layouts/ListingLayout';

const Legal = () => {
  return (
    <ListingLayout>
      <ListingStage title="Legal" subtitle="Papers please!">
        {/* AVS */}
        <ListingSection title="AVS License Number">
          <AvsLicenseInput />
        </ListingSection>

        {/* LICENSES */}
        <ListingSection title="Legal Tags">
          <LegalTagList />
        </ListingSection>
      </ListingStage>
    </ListingLayout>
  );
};

export default Legal;
