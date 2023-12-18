import React from 'react';
import Footer from '../components/kennel/footer/Footer';
import Navbar from '../components/kennel/navbar/Navbar';

interface KennelLayoutProps {
  children: React.ReactNode;
}

const KennelLayout: React.FC<KennelLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <Navbar />
        <main className="min-h-screen mt-4">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default KennelLayout;
