import React, { useEffect } from 'react';
import ProfileLayout from '../../layouts/ProfileLayout';
import UserPanel from '../../components/profile/user-panel/UserPanel';
import ProfilePanel from '../../components/profile/profile-panel/ProfilePanel';
import { store } from '../../store';
import { fetchMyListings } from '../../features/listing/listingSlice';

const Profile = () => {
  useEffect(() => {
    store.dispatch(fetchMyListings());
  }, [store]);

  return (
    <ProfileLayout>
      <UserPanel />
      <ProfilePanel />
    </ProfileLayout>
  );
};

export default Profile;
