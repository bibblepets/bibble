import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Searchbar from '../components/kennel/Searchbar';
import ListingGrid from '../components/kennel/listings/ListingGrid';
import { logoutUser, selectCurrentUser } from '../features/authSlice';
import KennelLayout from '../layouts/KennelLayout';
import { store } from '../store';

const Kennel = () => {
  const isAuthenticated = useSelector(selectCurrentUser);
  const currentUser = useSelector(selectCurrentUser);

  const logout = useCallback(() => {
    store.dispatch(logoutUser());
  }, [store]);

  return (
    <>
      <KennelLayout>
        <Searchbar />
        <ListingGrid />
      </KennelLayout>
    </>
  );
};

export default Kennel;
