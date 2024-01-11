import { authenticate } from '../features/user/userSlice';
import { fetchListings } from '../features/listing/kennelSlice';
import {
  generateLoginModalTitle,
  generateRegisterModalTitle
} from '../features/modalsSlice';
import {
  fetchAllBreeds,
  fetchAllCountries,
  fetchAllHairCoats,
  fetchAllLegalTags,
  fetchAllSpecies,
  fetchAllVaccines
} from '../features/listing/listingOptionsSlice';
import { store } from '../store';
import { fetchListingCreatorById } from '../features/listing/listingCreatorSlice';
import { LoaderFunction } from 'react-router-dom';
import { fetchListingById } from '../features/listing/listingEditorSlice';

export const kennelLoader: LoaderFunction = async () => {
  await store.dispatch(authenticate());
  await store.dispatch(fetchListings());
  await store.dispatch(fetchAllLegalTags());
  store.dispatch(generateRegisterModalTitle());
  store.dispatch(generateLoginModalTitle());
  return null;
};

export const listingLoader: LoaderFunction = async () => {
  await store.dispatch(fetchAllSpecies());
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
  await store.dispatch(authenticate());
  return null;
};
