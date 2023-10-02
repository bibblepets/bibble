import dogImg from '../../assets/dog1.jpeg';
import ListingOptions from '../../components/listing/listing/ListingOptions';
import ListingRow from '../../components/listing/listing/ListingRow';
import ListingLayout from '../../layouts/ListingLayout';

const dummyListings = [
  {
    species: 'Dog',
    breed: 'Golden Retriever',
    saleType: 'Sale',
    imgSrc: dogImg
  },
  {
    species: 'Dog',
    breed: 'Poodle',
    saleType: 'Adoption'
  },
  {
    species: 'Cat',
    breed: 'British Shorthair',
    saleType: 'Sale'
  },
  {
    species: 'Cat',
    breed: 'Street Cat',
    saleType: 'Sale'
  },
  {
    species: 'Dog',
    breed: 'Maltipoo',
    saleType: 'Adoption'
  },
  {
    species: 'Dog',
    breed: 'Siberian Husky',
    saleType: 'Sale'
  },
  {
    species: 'Dog',
    breed: 'Golden Retriever',
    saleType: 'Sale',
    imgSrc: dogImg
  },
  {
    species: 'Dog',
    breed: 'Poodle',
    saleType: 'Adoption'
  },
  {
    species: 'Cat',
    breed: 'British Shorthair',
    saleType: 'Sale'
  },
  {
    species: 'Cat',
    breed: 'Street Cat',
    saleType: 'Sale'
  },
  {
    species: 'Dog',
    breed: 'Maltipoo',
    saleType: 'Adoption'
  },
  {
    species: 'Dog',
    breed: 'Siberian Husky',
    saleType: 'Sale'
  },
  {
    species: 'Dog',
    breed: 'Golden Retriever',
    saleType: 'Sale',
    imgSrc: dogImg
  },
  {
    species: 'Dog',
    breed: 'Poodle',
    saleType: 'Adoption'
  },
  {
    species: 'Cat',
    breed: 'British Shorthair',
    saleType: 'Sale'
  },
  {
    species: 'Cat',
    breed: 'Street Cat',
    saleType: 'Sale'
  },
  {
    species: 'Dog',
    breed: 'Maltipoo',
    saleType: 'Adoption'
  },
  {
    species: 'Dog',
    breed: 'Siberian Husky',
    saleType: 'Sale'
  },
  {
    species: 'Dog',
    breed: 'Golden Retriever',
    saleType: 'Sale',
    imgSrc: dogImg
  },
  {
    species: 'Dog',
    breed: 'Poodle',
    saleType: 'Adoption'
  },
  {
    species: 'Cat',
    breed: 'British Shorthair',
    saleType: 'Sale'
  },
  {
    species: 'Cat',
    breed: 'Street Cat',
    saleType: 'Sale'
  },
  {
    species: 'Dog',
    breed: 'Maltipoo',
    saleType: 'Adoption'
  },
  {
    species: 'Dog',
    breed: 'Siberian Husky',
    saleType: 'Sale'
  }
];

const Listing = () => {
  const listings = dummyListings;

  return (
    <>
      <ListingLayout>
        <div className="flex flex-col w-full md:w-[756px] justify-center h-[75vh] px-4">
          <div className="flex flex-col flex-grow gap-8 overflow-hidden">
            <h1 className="text-3xl font-medium">Welcome back, Titus</h1>

            <div className="flex flex-col gap-4 h-full overflow-hidden">
              <a className="font-medium">Listings</a>

              {listings.length > 0 ? (
                <div className="flex flex-col gap-4 overflow-auto">
                  {listings.map((listing, index) => (
                    <ListingRow
                      key={index}
                      species={listing.species}
                      breed={listing.breed}
                      saleType={listing.saleType}
                      imgSrc={listing.imgSrc}
                    />
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
