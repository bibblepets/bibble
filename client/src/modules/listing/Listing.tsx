import { useDispatch, useSelector } from 'react-redux';
import ListingOptions from '../../components/listing/listing/ListingOptions';
import ListingRow from '../../components/listing/listing/ListingRow';
import ListingLayout from '../../layouts/ListingLayout';
import { useEffect } from 'react';
import { store } from '../../store';
import {
  fetchMyListingCreators,
  fetchMyListings,
  selectMyListings
} from '../../features/listingSlice';

const Listing = () => {
  const listings = useSelector(selectMyListings);

  useEffect(() => {
    store.dispatch(fetchMyListings());
    store.dispatch(fetchMyListingCreators());
  }, [store]);

  return (
    <>
      <ListingLayout>
        <div className="flex flex-col w-full md:w-[756px] justify-center h-[75vh] px-4">
          <div className="flex flex-col flex-grow gap-8 overflow-hidden">
            <h1 className="text-3xl font-medium">Welcome back, Titus</h1>

            <div className="flex flex-col gap-4 h-full overflow-hidden">
              <a className="font-medium">Continue where you left off</a>
              {listings.length > 0 ? (
                <div className="flex flex-col gap-4 overflow-auto">
                  {listings.map((listing, index) => (
                    <ListingRow key={index} listing={listing} />
                  ))}
                </div>
              ) : (
                <p className="font-light text-sm text-gray-500">
                  You haven't listed any pets yet. Get started with a listing.
                </p>
              )}
              <hr className="border-gray-200 my-4" />

              <a className="font-medium">View your listed pets</a>
              {listings.length > 0 ? (
                <div className="flex flex-col gap-4 overflow-auto">
                  {listings.map((listing, index) => (
                    <ListingRow key={index} listing={listing} />
                  ))}
                </div>
              ) : (
                <p className="font-light text-sm text-gray-500">
                  You haven't listed any pets yet. Get started with a listing.
                </p>
              )}
              <hr className="border-gray-200 my-4" />

              <ListingOptions />
            </div>
          </div>
        </div>
      </ListingLayout>
    </>
  );
};

export default Listing;
