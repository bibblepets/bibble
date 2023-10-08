import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import DetailsHeader from '../../components/kennel/details/DetailsHeader';
import ItemInfo from '../../components/kennel/details/ItemInfo';
import ListerInfo from '../../components/kennel/details/ListerInfo';
import { selectListingById } from '../../features/kennelSlice';
import KennelLayout from '../../layouts/KennelLayout';

const Details = () => {
  const location = useLocation();
  const id = location.pathname.split('/')[2];
  const listing = useSelector(selectListingById(id));

  if (!listing) {
    return null;
  }

  return (
    <>
      <KennelLayout>
        <div className="max-w-screen-lg mx-auto m-8 p-8">
          <div className="flex flex-col gap-6">
            <DetailsHeader listing={listing} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
              <div className="lg:col-span-3">
                {/* CHANGE INFO COMPONENT ACCORDING TO LISTING */}
                <ItemInfo listing={listing} />
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full h-full items-center justify-center border border-lime-500">
                  APPOINTMENT BOX
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8 mt-4">
              <ListerInfo listing={listing} />
            </div>
          </div>
        </div>
      </KennelLayout>
    </>
  );
};

export default Details;
