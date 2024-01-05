import React from 'react';
import Footer from '../components/listing/listingCreator/footer/Footer';
import Navbar from '../components/listing/listingCreator/navbar/Navbar';

interface ListingLayoutProps {
  children: React.ReactNode;
}

const ListingCreatorLayout: React.FC<ListingLayoutProps> = ({ children }) => {
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

export default ListingCreatorLayout;
