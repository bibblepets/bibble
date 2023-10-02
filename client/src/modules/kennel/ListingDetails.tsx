import KennelLayout from '../../layouts/KennelLayout';
import ItemInfo from '../../components/kennel/listings/details/ItemInfo';
import ListerInfo from '../../components/kennel/listings/details/ListerInfo';

const ListingDeatils = () => {
  return (
    <>
      <KennelLayout>
        <div className="max-w-screen-lg mx-auto my-10">
          <div className="flex flex-col gap-4">
            <>HEADER</>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
              <div className="lg:col-span-3">
                <ItemInfo />
              </div>
              <div className="lg:col-span-2">
                <>APPOINTMENT BOX</>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <ListerInfo />
            </div>
          </div>
        </div>
      </KennelLayout>
    </>
  );
};

export default ListingDeatils;
