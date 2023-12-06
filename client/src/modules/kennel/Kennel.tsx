import ListingGrid from '../../components/kennel/listings/ListingGrid';
import Searchbar from '../../components/kennel/searchbar/Searchbar';
import KennelLayout from '../../layouts/KennelLayout';

const Kennel = () => {
  return (
    <KennelLayout>
      <Searchbar />
      <ListingGrid />
    </KennelLayout>
  );
};

export default Kennel;
