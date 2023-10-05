import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ListingGrid from '../../components/kennel/listings/ListingGrid';
import Searchbar from '../../components/kennel/searchbar/Searchbar';
import {
  fetchListings,
  selectKennelError,
  selectKennelListings,
  selectKennelStatus
} from '../../features/kennelSlice';
import KennelLayout from '../../layouts/KennelLayout';
import { store } from '../../store';

const Kennel = () => {
  const listings = useSelector(selectKennelListings);
  const status = useSelector(selectKennelStatus);
  const error = useSelector(selectKennelError);

  useEffect(() => {
    store.dispatch(fetchListings());
  }, [store]);

  if (status === 'LOADING') {
    return <div>Loading...</div>;
  }

  if (status === 'ERROR') {
    return <div>Error: {error}</div>;
  }
  return (
    <KennelLayout>
      <Searchbar />
      <ListingGrid />
    </KennelLayout>
  );
};

export default Kennel;
