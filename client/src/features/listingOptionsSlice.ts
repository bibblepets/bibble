import axios from 'axios';
import { Breed, Country, StatusType, Vaccine } from '../types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ListingOptionsSlice {
  breeds: Breed[];
  countries: Country[];
  vaccines: Vaccine[];
  status: StatusType;
  error?: string;
}

const initialState: ListingOptionsSlice = {
  breeds: [],
  countries: [],
  vaccines: [],
  status: 'DEFAULT',
  error: undefined
};

export const fetchAllBreeds = createAsyncThunk(
  '/listingOptionsSlice/fetchAllBreeds',
  async () => {
    return await axios
      .get(`/api/developer/breeds/${'Dog'}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const fetchAllCountries = createAsyncThunk(
  '/listingOptionsSlice/fetchAllCountries',
  async () => {
    return await axios
      .get(`/api/developer/countries`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const fetchAllVaccines = createAsyncThunk(
  '/listingOptionsSlice/fetchAllVaccines',
  async () => {
    return await axios
      .get(`/api/developer/vaccines/${'Dog'}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const listingOptionsSlice = createSlice({
  name: 'listingOptionsSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllBreeds.pending, (state) => {
      state.status = 'LOADING';
    });
    builder.addCase(fetchAllBreeds.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.breeds = action.payload;
    });
    builder.addCase(fetchAllBreeds.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
    builder.addCase(fetchAllCountries.pending, (state) => {
      state.status = 'LOADING';
    });
    builder.addCase(fetchAllCountries.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.countries = action.payload;
    });
    builder.addCase(fetchAllCountries.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
    builder.addCase(fetchAllVaccines.pending, (state) => {
      state.status = 'LOADING';
    });
    builder.addCase(fetchAllVaccines.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.vaccines = action.payload;
    });
    builder.addCase(fetchAllVaccines.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
  }
});

export const selectListingOptionsBreeds =
  (species?: string) => (state: RootState) =>
    state.listingOptions.breeds
      .filter((breed) => breed.species === species)
      .sort((a, b) => a.name.localeCompare(b.name));
export const selectListingOptionsCountries = (state: RootState) =>
  state.listingOptions.countries;
export const selectListingOptionsVaccines =
  (species?: string) => (state: RootState) =>
    state.listingOptions.vaccines.filter(
      (vaccine) => vaccine.species === species
    );
export const selectListingOptionsStatus = (state: RootState) =>
  state.listingOptions.status;
export const selectListingOptionsError = (state: RootState) =>
  state.listingOptions.error;

export default listingOptionsSlice.reducer;
