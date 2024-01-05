import AvsLicenseInput from '../../../components/listing/listingCreator/legal/AvsLicenseInput';
import LegalTagList from '../../../components/listing/listingCreator/legal/LegalTagList';
import ListingCreatorSection from '../../../components/listing/listingCreator/ListingCreatorSection';
import ListingCreatorStage from '../../../components/listing/listingCreator/ListingCreatorStage';
import ListingCreatorLayout from '../../../layouts/ListingCreatorLayout';

const Legal = () => {
  return (
    <ListingCreatorLayout>
      <ListingCreatorStage title="Legal" subtitle="Papers please!">
        {/* AVS */}
        <ListingCreatorSection
          title="AVS License Number"
          field="avsLicenseNumber"
        >
          <AvsLicenseInput />
        </ListingCreatorSection>

        {/* LICENSES */}
        <ListingCreatorSection title="Legal Tags" field="legalTags">
          <LegalTagList />
        </ListingCreatorSection>
      </ListingCreatorStage>
    </ListingCreatorLayout>
  );
};

export default Legal;
