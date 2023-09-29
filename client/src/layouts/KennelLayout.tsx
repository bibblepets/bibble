import React from 'react';
import Navbar from '../components/kennel/Navbar';

interface PageLayoutProps {
  children: React.ReactNode;
}

const KennelLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />

      {children}

      <footer className="absolute w-full bottom-0">
        <div className="flex justify-center border border-lime-500">
          Footer Component
        </div>
      </footer>
    </>
  );
};

export default KennelLayout;
