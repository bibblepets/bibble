import BusinessProfileContactInfo from '../../components/business/profile/BusinessProfileContactInfo';
import BusinessProfileDescription from '../../components/business/profile/BusinessProfileDescription';
import BusinessProfileHeader from '../../components/business/profile/BusinessProfileHeader';
import BusinessProfileLocation from '../../components/business/profile/BusinessProfileLocation';
import BusinessProfileMedia from '../../components/business/profile/BusinessProfileMedia';
import BusinessProfileSection from '../../components/business/profile/BusinessProfileSection';
import EditBusinessProfileContactInfo from '../../components/business/profile/EditBusinessProfileContactInfo';
import EditBusinessProfileDescription from '../../components/business/profile/EditBusinessProfileDescription';
import EditBusinessProfileLocation from '../../components/business/profile/EditBusinessProfileLocation';
import EditBusinessProfileMedia from '../../components/business/profile/EditBusinessProfileMedia';
import BusinessLayout from '../../layouts/BusinessLayout';

const BusinessProfile = () => {
  return (
    <BusinessLayout small>
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <BusinessProfileSection>
          <BusinessProfileHeader />
        </BusinessProfileSection>
        <BusinessProfileSection
          title="Contact Information"
          editComponent={EditBusinessProfileContactInfo}
        >
          <BusinessProfileContactInfo />
        </BusinessProfileSection>
        <BusinessProfileSection
          title="About"
          editComponent={EditBusinessProfileDescription}
        >
          <BusinessProfileDescription />
        </BusinessProfileSection>
        <BusinessProfileSection
          title="Location"
          editComponent={EditBusinessProfileLocation}
        >
          <BusinessProfileLocation />
        </BusinessProfileSection>
        <BusinessProfileSection
          title="Media"
          editComponent={EditBusinessProfileMedia}
        >
          <BusinessProfileMedia />
        </BusinessProfileSection>
        <h1 className="text-4xl font-bold">Listings</h1>
        <h1 className="text-4xl font-bold">Reviews</h1>
        <h1 className="text-4xl font-bold">Links</h1>
      </div>
    </BusinessLayout>
  );
};

export default BusinessProfile;
