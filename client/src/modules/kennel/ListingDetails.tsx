import KennelLayout from '../../layouts/KennelLayout';
import DogInfo from '../../components/kennel/listings/details/DogInfo';
import ListerInfo from '../../components/kennel/listings/details/ListerInfo';
import DetailsHeader from '../../components/kennel/listings/details/DetailsHeader';

const ListingDeatils = () => {
  return (
    <>
      <KennelLayout>
        <div className="max-w-screen-lg mx-auto my-10">
          <div className="flex flex-col gap-6">
            <DetailsHeader />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
              <div className="lg:col-span-3">
                {/* CHANGE INFO COMPONENT ACCORDING TO LISTING */}
                <DogInfo />
              </div>
              <div className="lg:col-span-2">
                <>APPOINTMENT BOX</>
              </div>
            </div>

            <div className="flex flex-col gap-8 mt-4">
              <ListerInfo />
            </div>
          </div>
        </div>
      </KennelLayout>
    </>
  );
};

export default ListingDeatils;
