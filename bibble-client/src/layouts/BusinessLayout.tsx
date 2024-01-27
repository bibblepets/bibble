import React from 'react';
import Navbar from '../components/business/navbar/Navbar';

interface BusinessLayoutProps {
  children: React.ReactNode;
}

const BusinessLayout: React.FC<BusinessLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <Navbar />
      <main className="max-w-screen-xl w-full">{children}</main>
    </div>
  );
};

export default BusinessLayout;
