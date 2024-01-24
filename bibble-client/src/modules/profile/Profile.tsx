import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { selectAccountType } from '../../features/user/userSlice';
import UserProfile from './UserProfile';

const Profile = () => {
  const accountType = useSelector(selectAccountType);

  switch (accountType) {
    case 'user':
      return <UserProfile />;
    case 'business':
      return <div>Business profile to implement</div>;
    default:
      return <Navigate to="/" replace={true} />;
  }
};

export default Profile;
