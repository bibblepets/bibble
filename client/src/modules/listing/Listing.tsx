import { useDispatch, useSelector } from 'react-redux';
import ListingOptions from '../../components/listing/listing/ListingOptions';
import ListingRow from '../../components/listing/listing/ListingRow';
import ListingLayout from '../../layouts/ListingLayout';
import { useEffect } from 'react';
import { store } from '../../store';
import {
  fetchMyListingCreators,
  fetchMyListings,
  selectMyListingCreators,
  selectMyListingCreatorsIsLoading,
  selectMyListings,
  selectMyListingsIsLoading
} from '../../features/listingSlice';
import ListingCreatorRow from '../../components/listing/listing/ListingCreatorRow';
import SkeletonLoader from '../../components/loaders/SkeletonLoader';
import { selectCurrentUser } from '../../features/userSlice';

const Listing = () => {
  const currentUser = useSelector(selectCurrentUser);
  const listings = useSelector(selectMyListings);
  const listingCreators = useSelector(selectMyListingCreators);
  const isListingsLoading = useSelector(selectMyListingsIsLoading);
  const isListingCreatorsLoading = useSelector(
    selectMyListingCreatorsIsLoading
  );

  useEffect(() => {
    store.dispatch(fetchMyListings());
    store.dispatch(fetchMyListingCreators());
  }, [store]);

  return (
    <ListingLayout>
      <div className="flex flex-col w-full md:w-[756px] justify-center h-[75vh] px-4 overflow-hidden">
        <div className="flex flex-col flex-grow gap-8 overflow-hidden">
          <h1 className="text-3xl font-medium">
            Welcome back,{' '}
            {currentUser?.businessProfile?.businessName ||
              currentUser?.buyerProfile?.firstName}
          </h1>

          <div className="flex flex-col gap-4 h-full overflow-auto">
            <div className="flex flex-col gap-4 h-1/2">
              <a className="font-medium">Continue where you left off</a>
              {listingCreators.length > 0 ? (
                <div className="flex flex-col gap-4 overflow-auto">
                  {listingCreators.map((listingCreator, index) => (
                    <ListingCreatorRow
                      key={index}
                      listingCreator={listingCreator}
                    />
                  ))}
                </div>
              ) : isListingCreatorsLoading ? (
                <SkeletonLoader />
              ) : (
                <p className="font-light text-sm text-gray-500">
                  You haven't listed any pets yet. Get started with a listing.
                </p>
              )}
            </div>
            <hr className="border-gray-200 my-4" />

            <div className="flex flex-col gap-4 h-1/2">
              <a className="font-medium">View your listed pets</a>
              {listings.length > 0 ? (
                <div className="flex flex-col gap-4 overflow-auto">
                  {listings.map((listing, index) => (
                    <ListingRow key={index} listing={listing} />
                  ))}
                </div>
              ) : isListingsLoading ? (
                <SkeletonLoader />
              ) : (
                <p className="font-light text-sm text-gray-500">
                  You haven't listed any pets yet. Get started with a listing.
                </p>
              )}
            </div>
            <hr className="border-gray-200 my-4" />
          </div>
          <ListingOptions />
        </div>
      </div>
    </ListingLayout>
  );
};

export default Listing;
