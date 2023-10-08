import { checkAuthStatus } from '../features/authSlice';
import { fetchListings } from '../features/kennelSlice';
import { store } from '../store';

export const kennelLoader = async () => {
  await store.dispatch(checkAuthStatus());
  await store.dispatch(fetchListings());
  return null;
};
