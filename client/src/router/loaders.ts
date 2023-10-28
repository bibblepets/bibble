import { checkAuthStatus } from '../features/authSlice';
import { fetchListings } from '../features/kennelSlice';
import {
  generateLoginModalTitle,
  generateRegisterModalTitle
} from '../features/modalsSlice';
import { store } from '../store';

export const kennelLoader = async () => {
  await store.dispatch(checkAuthStatus());
  await store.dispatch(fetchListings());
  await store.dispatch(generateRegisterModalTitle());
  await store.dispatch(generateLoginModalTitle());
  return null;
};
