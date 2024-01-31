import React from 'react';
import Logo from '../../global/Logo';
import BusinessMenu from './BusinessMenu';

type NavbarProps = {
  small?: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ small }) => {
  return (
    <nav className="absolute sticky flex justify-center w-full top-0 z-40 border-b bg-white">
      <div className={`w-full ${small && 'max-w-screen-xl'}`}>
        <div className="flex flex-row px-8 justify-between items-center p-6">
          <Logo />
          <BusinessMenu tabs={[]} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
