import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfilePanel from '../../components/profile/profile-panel/user/UserProfilePanel';
import UserPanel from '../../components/profile/user-panel/UserPanel';
import { fetchMyListings } from '../../features/listing/listingSlice';
import ProfileLayout from '../../layouts/ProfileLayout';
import { store } from '../../store';

const UserProfile = () => {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate('/business/register');
  }, [navigate]);

  useEffect(() => {
    store.dispatch(fetchMyListings());
  }, [store]);

  return (
    <ProfileLayout>
      <div className="flex flex-col lg:flex-row">
        <UserPanel />
        <UserProfilePanel />
      </div>
      <br />
      <section className="flex flex-col items-center w-full">
        <label className="font-light text-gray-500">
          Want a Bibble Business?{' '}
          <a
            onClick={onClick}
            className="text-sky-500 font-semibold cursor-pointer"
          >
            Register here!
          </a>
        </label>
      </section>
    </ProfileLayout>
  );
};

export default UserProfile;
