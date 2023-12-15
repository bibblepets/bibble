import { checkAuthStatus } from '../features/authSlice';
import { fetchListings } from '../features/kennelSlice';
import {
  generateLoginModalTitle,
  generateRegisterModalTitle
} from '../features/modalsSlice';
import {
  fetchAllBreeds,
  fetchAllCountries,
  fetchAllVaccines
} from '../features/listingOptionsSlice';
import { store } from '../store';

export const kennelLoader = async () => {
  await store.dispatch(checkAuthStatus());
  await store.dispatch(fetchListings());
  store.dispatch(generateRegisterModalTitle());
  store.dispatch(generateLoginModalTitle());
  return null;
};

export const listingLoader = async () => {
  await store.dispatch(fetchAllBreeds());
  await store.dispatch(fetchAllCountries());
  await store.dispatch(fetchAllVaccines());
  return null;
};
