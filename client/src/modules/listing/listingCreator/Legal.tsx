import AvsLicenseInput from '../../../components/listing/listingCreator/legal/AvsLicenseInput';
import LegalTagList from '../../../components/listing/listingCreator/legal/LegalTagList';
import ListingSection from '../../../components/listing/listing/ListingSection';
import ListingStage from '../../../components/listing/listing/ListingStage';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Legal = () => {
  return (
    <ListingCreatorLayout>
      <ListingStage title="Legal" subtitle="Papers please!">
        {/* AVS */}
        <ListingSection title="AVS License Number" field="avsLicenseNumber">
          <AvsLicenseInput />
        </ListingSection>

        {/* LICENSES */}
        <ListingSection title="Legal Tags" field="legalTags">
          <LegalTagList />
        </ListingSection>
      </ListingStage>
    </ListingCreatorLayout>
  );
};

export default Legal;
