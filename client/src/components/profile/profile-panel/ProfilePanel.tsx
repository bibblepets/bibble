import React from 'react';
import ProfileAbout from './ProfileAbout';
import ProfileListings from './ProfileListings';

const ProfilePanel = () => {
  return (
    <section className="flex-grow p-8">
      <div className="flex flex-col gap-8">
        <ProfileAbout />
        <hr />
        <ProfileListings />
      </div>
    </section>
  );
};

export default ProfilePanel;
