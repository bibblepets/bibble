import logo from '/images/logo.png';
import logoIcon from '/images/logo-icon.png';
import React from 'react';

interface LogoProps {
  small?: boolean;
}

const Logo: React.FC<LogoProps> = ({ small }) => {
  return (
    <a href="/" className="w-64">
      <img
        className="h-[20px]"
        src={small ? logoIcon : logo}
        alt="bibble-logo"
      />
    </a>
  );
};

export default Logo;
