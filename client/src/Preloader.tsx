import { useEffect } from 'react';
import { checkAuthStatus } from './features/authSlice';
import { store } from './store';

const Preloader = () => {
  useEffect(() => {
    store.dispatch(checkAuthStatus());
  }, []);

  return null;
};

export default Preloader;
