import { useSearchParams } from 'react-router-dom';
import UserProfileAbout from './UserProfileAbout';
import UserProfileEdit from './UserProfileEdit';
import UserProfileListings from './UserProfileListings';

const UserProfilePanel = () => {
  const [searchParams] = useSearchParams();

  if (searchParams.get('edit')) {
    return (
      <section className="flex-grow p-8">
        <UserProfileEdit />
      </section>
    );
  }

  return (
    <section className="flex-grow p-8">
      <div className="flex flex-col gap-8">
        <UserProfileAbout />
        <hr />
        <UserProfileListings />
      </div>
    </section>
  );
};

export default UserProfilePanel;
