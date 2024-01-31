import { LoaderFunction } from 'react-router-dom';
import { authenticateBusiness } from '../features/business/businessSlice';
import { fetchListings } from '../features/listing/kennelSlice';
import { fetchListingCreatorById } from '../features/listing/listingCreatorSlice';
import { fetchListingById } from '../features/listing/listingEditorSlice';
import {
  fetchAllBreeds,
  fetchAllCountries,
  fetchAllHairCoats,
  fetchAllLegalTags,
  fetchAllSpecies,
  fetchAllVaccines
} from '../features/listing/listingOptionsSlice';
import {
  generateLoginModalTitle,
  generateRegisterModalTitle
} from '../features/modalsSlice';
import { authenticate } from '../features/user/userSlice';
import { store } from '../store';

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

export const businessLoader: LoaderFunction = async () => {
  await store.dispatch(authenticateBusiness());
  return null;
};
