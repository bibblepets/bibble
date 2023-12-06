import LicenseList from '../../components/listing/legal/LicenseList';
import ListingSection from '../../components/listing/listing/ListingSection';
import ListingStage from '../../components/listing/listing/ListingStage';
import ListingLayout from '../../layouts/ListingLayout';

const Legal = () => {
  return (
    <ListingLayout>
      <ListingStage title="Legal" subtitle="Now for some legal details...">
        {/* LICENSES */}
        <ListingSection title="Licenses">
          <LicenseList />
        </ListingSection>
      </ListingStage>
    </ListingLayout>
  );
};

export default Legal;
