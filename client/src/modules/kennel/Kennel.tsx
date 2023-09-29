import Searchbar from '../../components/kennel/Searchbar';
import ListingGrid from '../../components/kennel/listings/ListingGrid';
import KennelLayout from '../../layouts/KennelLayout';

const Kennel = () => {
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
