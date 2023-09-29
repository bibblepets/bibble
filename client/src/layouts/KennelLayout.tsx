import React from 'react';
import Footer from '../components/kennel/footer/Footer';
import Navbar from '../components/kennel/navbar/Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
}

const KennelLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-[2000px]">
        <Navbar />
        <main className="mt-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default KennelLayout;
