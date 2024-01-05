import axios from 'axios';
import { Breed, Country, StatusType, Vaccine } from '../types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ListingOptionsSlice {
  breeds: Breed[];
  countries: Country[];
  hairCoats: string[];
  vaccines: Vaccine[];
  legalTags: string[];
  status: StatusType;
  error?: string;
}

const initialState: ListingOptionsSlice = {
  breeds: [],
  countries: [],
  hairCoats: [],
  vaccines: [],
  legalTags: [],
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

export const fetchAllHairCoats = createAsyncThunk(
  '/listingOptionsSlice/fetchAllHairCoats',
  async () => {
    return await axios
      .get(`/api/developer/hair-coats/${'Dog'}`)
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

export const fetchAllLegalTags = createAsyncThunk(
  '/listingOptionsSlice/fetchAllLegalTags',
  async () => {
    return await axios
      .get(`/api/developer/legal-tags/${'Dog'}`)
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
    builder.addCase(fetchAllHairCoats.pending, (state) => {
      state.status = 'LOADING';
    });
    builder.addCase(fetchAllHairCoats.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.hairCoats = action.payload;
    });
    builder.addCase(fetchAllHairCoats.rejected, (state, action) => {
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
    builder.addCase(fetchAllLegalTags.pending, (state) => {
      state.status = 'LOADING';
    });
    builder.addCase(fetchAllLegalTags.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.legalTags = action.payload;
    });
    builder.addCase(fetchAllLegalTags.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
  }
});

export const selectListingOptionsBreeds = (state: RootState) =>
  state.listingOptions.breeds;
export const selectListingOptionsCountries = (state: RootState) =>
  state.listingOptions.countries;
export const selectListingOptionsHairCoats = (state: RootState) =>
  state.listingOptions.hairCoats;
export const selectListingOptionsVaccines = (state: RootState) =>
  state.listingOptions.vaccines;
export const selectListingOptionsCoreVaccines = (state: RootState) =>
  state.listingOptions.vaccines.filter((vaccine) => vaccine.isCore);
export const selectListingOptionsLegalTags = (state: RootState) =>
  state.listingOptions.legalTags;
export const selectListingOptionsStatus = (state: RootState) =>
  state.listingOptions.status;
export const selectListingOptionsError = (state: RootState) =>
  state.listingOptions.error;

export default listingOptionsSlice.reducer;
