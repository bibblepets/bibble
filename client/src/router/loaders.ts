import { checkAuthStatus } from '../features/authSlice';
import { fetchListings } from '../features/kennelSlice';
import {
  fetchAllBreeds,
  fetchAllCountries,
  fetchAllVaccines
} from '../features/listingOptionsSlice';
import { store } from '../store';

export const kennelLoader = async () => {
  await store.dispatch(checkAuthStatus());
  await store.dispatch(fetchListings());
  return null;
};

export const listingLoader = async () => {
  await store.dispatch(fetchAllBreeds());
  await store.dispatch(fetchAllCountries());
  await store.dispatch(fetchAllVaccines());
  return null;
};
