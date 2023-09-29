import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { logoutUser, selectCurrentUser } from '../../features/authSlice';
import KennelLayout from '../../layouts/KennelLayout';
import { store } from '../../store';

const Kennel = () => {
  const isAuthenticated = useSelector(selectCurrentUser);
  const currentUser = useSelector(selectCurrentUser);

  const logout = useCallback(() => {
    store.dispatch(logoutUser());
  }, [store]);

  return (
    <>
      <KennelLayout>
        <main className="flex items-center justify-center h-[100vh]">
          {isAuthenticated
            ? `${currentUser?.name} is logged in`
            : 'Not logged in'}
        </main>
      </KennelLayout>
    </>
  );
};

export default Kennel;
