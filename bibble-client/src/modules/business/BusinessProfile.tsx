import { useState } from 'react';
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
  const [isEditingContactInfo, setIsEditingContactInfo] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingMedia, setIsEditingMedia] = useState(false);
  return (
    <BusinessLayout small>
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <BusinessProfileSection
          isEditing={false}
          setIsEditing={() => {}}
          component={BusinessProfileHeader}
        />
        <BusinessProfileSection
          isEditing={isEditingContactInfo}
          setIsEditing={setIsEditingContactInfo}
          component={BusinessProfileContactInfo}
          editComponent={EditBusinessProfileContactInfo}
        />
        <BusinessProfileSection
          isEditing={isEditingDescription}
          setIsEditing={setIsEditingDescription}
          component={BusinessProfileDescription}
          editComponent={EditBusinessProfileDescription}
        />
        <BusinessProfileSection
          isEditing={isEditingLocation}
          setIsEditing={setIsEditingLocation}
          component={BusinessProfileLocation}
          editComponent={EditBusinessProfileLocation}
        />
        <BusinessProfileSection
          isEditing={isEditingMedia}
          setIsEditing={setIsEditingMedia}
          component={BusinessProfileMedia}
          editComponent={EditBusinessProfileMedia}
        />
        :<h1 className="text-4xl font-bold">Listings</h1>
        <h1 className="text-4xl font-bold">Reviews</h1>
        <h1 className="text-4xl font-bold">Links</h1>
      </div>
    </BusinessLayout>
  );
};

export default BusinessProfile;
