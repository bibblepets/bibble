import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Login from '../../components/Login';
import Navbar from '../../components/kennel/Navbar';
import { logoutUser, selectCurrentUser } from '../../features/authSlice';
import { store } from '../../store';

const Kennel = () => {
  const isAuthenticated = useSelector(selectCurrentUser);
  const currentUser = useSelector(selectCurrentUser);

  const logout = useCallback(() => {
    store.dispatch(logoutUser());
  }, [store]);

  return (
    <>
      <Navbar />

      <main className="flex items-center justify-center h-[100vh]">
        {isAuthenticated ? (
          <div
            onClick={logout}
            className="p-8 border hover:bg-neutral-200 cursor-pointer"
          >
            Hello {currentUser?.name}
          </div>
        ) : (
          <Login />
        )}
      </main>

      <footer className="absolute w-full bottom-0">
        <div className="flex justify-center border border-lime-500">
          Footer Component
        </div>
      </footer>
    </>
  );
};

export default Kennel;
