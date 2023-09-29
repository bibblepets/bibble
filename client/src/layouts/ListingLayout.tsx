import React from 'react';
import Footer from '../components/listing/footer/Footer';
import Navbar from '../components/listing/navbar/Navbar';

interface ListingLayoutProps {
  children: React.ReactNode;
}

const ListingLayout: React.FC<ListingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <Navbar />
        <main className="flex flex-col justify-center items-center min-h-screen ">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ListingLayout;
