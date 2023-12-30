import { checkAuthStatus } from '../features/authSlice';
import { fetchListings } from '../features/kennelSlice';
import {
  generateLoginModalTitle,
  generateRegisterModalTitle
} from '../features/modalsSlice';
import {
  fetchAllBreeds,
  fetchAllCountries,
  fetchAllHairCoats,
  fetchAllLegalTags,
  fetchAllVaccines
} from '../features/listingOptionsSlice';
import { store } from '../store';
import { fetchListingCreatorById } from '../features/listingCreatorSlice';
import { LoaderFunction } from 'react-router-dom';
import { fetchListingById } from '../features/listingEditorSlice';

export const kennelLoader: LoaderFunction = async () => {
  await store.dispatch(checkAuthStatus());
  await store.dispatch(fetchListings());
  store.dispatch(generateRegisterModalTitle());
  store.dispatch(generateLoginModalTitle());
  return null;
};

export const listingLoader: LoaderFunction = async () => {
  await store.dispatch(fetchAllBreeds());
  await store.dispatch(fetchAllCountries());
  await store.dispatch(fetchAllHairCoats());
  await store.dispatch(fetchAllVaccines());
  await store.dispatch(fetchAllLegalTags());
  return null;
};

export const listingCreatorLoader: LoaderFunction = async ({ params }) => {
  const listingId = params.id || '';
  await store.dispatch(fetchListingCreatorById(listingId));
  return null;
};

export const listingEditorLoader: LoaderFunction = async ({ params }) => {
  const listingId = params.id || '';
  await store.dispatch(fetchListingById(listingId));
  return null;
};

export const profileLoader: LoaderFunction = async () => {
  await store.dispatch(checkAuthStatus());
  return null;
};
