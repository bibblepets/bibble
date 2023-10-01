import React from 'react';
import Footer from '../components/listing/footer/Footer';
import Navbar from '../components/listing/navbar/Navbar';

interface ListingLayoutProps {
  children: React.ReactNode;
}

const ListingLayout: React.FC<ListingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <Navbar />
      <main className="flex flex-col w-full h-full justify-center items-center mt-[85px] mb-[84px] py-12 overflow-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ListingLayout;
