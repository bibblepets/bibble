import React from 'react';
import Navbar from '../components/business/navbar/Navbar';

interface BusinessLayoutProps {
  children: React.ReactNode;
  small?: boolean;
}

const BusinessLayout: React.FC<BusinessLayoutProps> = ({ children, small }) => {
  return (
    <div className="flex flex-col items-center w-full h-screen">
      <Navbar small={small} />
      <main
        className={`${small && 'max-w-screen-xl'} w-full pt-[86px] pb-[84px]`}
      >
        {children}
      </main>
    </div>
  );
};

export default BusinessLayout;
