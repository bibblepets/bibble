import React from 'react';
import logoIcon from '/images/logo-icon.png';
import logo from '/images/logo.png';

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
