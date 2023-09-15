import { useEffect } from 'react';
import { fetchCurrentUser } from './features/user/authSlice';
import { store } from './store';

const Preloader = () => {
  useEffect(() => {
    store.dispatch(fetchCurrentUser());
  }, []);

  return null;
};

export default Preloader;
