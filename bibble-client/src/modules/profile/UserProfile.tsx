import { useEffect } from 'react';
import UserProfilePanel from '../../components/profile/profile-panel/user/UserProfilePanel';
import UserPanel from '../../components/profile/user-panel/UserPanel';
import { fetchMyListings } from '../../features/listing/listingSlice';
import ProfileLayout from '../../layouts/ProfileLayout';
import { store } from '../../store';

const UserProfile = () => {
  useEffect(() => {
    store.dispatch(fetchMyListings());
  }, [store]);

  return (
    <ProfileLayout>
      <main className="flex flex-col lg:flex-row">
        <UserPanel />
        <UserProfilePanel />
      </main>
      <br />
      <section className="flex flex-col items-center w-full">
        <label className="font-light text-gray-500">
          Want a Bibble Business?{' '}
          <span className="text-sky-500 font-semibold">Register here!</span>
        </label>
      </section>
    </ProfileLayout>
  );
};

export default UserProfile;
