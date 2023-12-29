import React from 'react';
import ProfileLayout from '../../layouts/ProfileLayout';
import UserPanel from '../../components/profile/user-panel/UserPanel';
import ProfilePanel from '../../components/profile/profile-panel/ProfilePanel';

const Profile = () => {
  return (
    <ProfileLayout>
      <UserPanel />
      <ProfilePanel />
    </ProfileLayout>
  );
};

export default Profile;
