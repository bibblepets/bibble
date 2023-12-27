import React from 'react';
import Navbar from '../components/listing/listingEditor/navbar/Navbar';

interface ListingLayoutProps {
  children: React.ReactNode;
}

const ListingEditorLayout: React.FC<ListingLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex flex-row pt-[86px] h-full">{children}</main>
    </div>
  );
};

export default ListingEditorLayout;
