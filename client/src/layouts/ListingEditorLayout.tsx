import React from 'react';
import Navbar from '../components/listing/listingEditor/navbar/Navbar';

interface ListingLayoutProps {
  children: React.ReactNode;
}

const ListingEditorLayout: React.FC<ListingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      <Navbar />
      <main className="flex flex-col w-full h-full justify-center items-center mt-[85px] mb-[84px] overflow-auto">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default ListingEditorLayout;
