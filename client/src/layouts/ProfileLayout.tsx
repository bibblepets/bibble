import React from 'react';
import Navbar from '../components/profile/navbar/Navbar';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <Navbar />
      <main className="flex flex-col lg:flex-row justify-center max-w-screen-xl w-full mt-4">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;
