import React from 'react';
import ProfileAbout from './ProfileAbout';
import ProfileListings from './ProfileListings';
import { useSearchParams } from 'react-router-dom';
import ProfileEdit from './ProfileEdit';

const ProfilePanel = () => {
  const [searchParams] = useSearchParams();

  if (searchParams.get('edit')) {
    return (
      <section className="flex-grow p-8">
        <ProfileEdit />
      </section>
    );
  }

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
