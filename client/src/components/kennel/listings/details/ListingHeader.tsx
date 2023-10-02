import placeholder from '../../../../assets/dog1.jpeg';

const ListingHeader = () => {
  const images = [placeholder, placeholder, placeholder, placeholder];
  return (
    <>
      {/* Head Banner */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Listing Title</h1>
          <p className="text-lg">Listing Description</p>
        </div>
        <div className="flex place-self-end gap-2">
          'SHARE' 'HEART'
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Cover Image */}
        <div className="w-full aspect-square overflow-hidden rounded-2xl relative">
          <img src={placeholder} className="object-cover w-full" />
        </div>

        {/* Grid of 4 Images */}
        <div className="grid grid-cols-2 gap-2">
          {images.slice(0, 4).map((img, i) => {
              return (
                <div
                  key={i}
                  className="w-full aspect-square overflow-hidden rounded-2xl relative"
                >
                  <img src={img} className="object-cover w-full" />
                </div>
              );
          })}
        </div>
      </div>
    </>
  );
};

export default ListingHeader;
