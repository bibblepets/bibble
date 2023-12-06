import { useSelector } from 'react-redux';
import { selectKennelListings } from '../../../features/kennelSlice';
import ListingCard from './ListingCard';

const ListingGrid = () => {
  const listings = useSelector(selectKennelListings);

  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 p-12">
      {listings.map((listing, index) => (
        <ListingCard key={index} listing={listing} />
      ))}
    </div>
  );
};

export default ListingGrid;
