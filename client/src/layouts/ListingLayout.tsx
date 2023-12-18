import React, { useEffect } from 'react';
import Footer from '../components/listing/footer/Footer';
import Navbar from '../components/listing/navbar/Navbar';
import { useSelector } from 'react-redux';
import {
  selectListingError,
  selectListingStatus
} from '../features/listingCreatorSlice';
import toast from 'react-hot-toast';

interface ListingLayoutProps {
  children: React.ReactNode;
}

const ListingLayout: React.FC<ListingLayoutProps> = ({ children }) => {
  const status = useSelector(selectListingStatus);
  const error = useSelector(selectListingError);

  useEffect(() => {
    if (status === 'ERROR' && error) {
      toast.error(error);
    }
  }, [status, error]);

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <Navbar />
      <main className="flex flex-col w-full h-full justify-center items-center mt-[85px] mb-[84px] overflow-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ListingLayout;
