import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { ListingCreator } from './types';
import { StatusType } from '../types';

interface ListingState {
  myListings: {
    data: any[];
    status: StatusType;
    error?: string;
  };
  myListingCreators: {
    data: ListingCreator[];
    status: StatusType;
    error?: string;
  };
}

const initialState: ListingState = {
  myListings: {
    data: [],
    status: 'DEFAULT',
    error: undefined
  },
  myListingCreators: {
    data: [],
    status: 'DEFAULT',
    error: undefined
  }
};

export const fetchMyListings = createAsyncThunk(
  '/listingSlice/fetchMyListings',
  async () => {
    return await axios
      .get('/kennel/listings/self')
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const fetchMyListingCreators = createAsyncThunk(
  '/listingSlice/fetchMyListingCreators',
  async () => {
    return await axios
      .get('/kennel/listing-creator')
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

const listingSlice = createSlice({
  name: 'listingSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMyListings.pending, (state) => {
      state.myListings.status = 'LOADING';
    });
    builder.addCase(fetchMyListings.fulfilled, (state, action) => {
      state.myListings.status = 'SUCCESS';
      state.myListings.data = action.payload;
    });
    builder.addCase(fetchMyListings.rejected, (state, action) => {
      state.myListings.status = 'ERROR';
      state.myListings.error = action.error.message;
    });
    builder.addCase(fetchMyListingCreators.pending, (state) => {
      state.myListingCreators.status = 'LOADING';
    });
    builder.addCase(fetchMyListingCreators.fulfilled, (state, action) => {
      state.myListingCreators.status = 'SUCCESS';
      state.myListingCreators.data = action.payload;
    });
    builder.addCase(fetchMyListingCreators.rejected, (state, action) => {
      state.myListingCreators.status = 'ERROR';
      state.myListingCreators.error = action.error.message;
    });
  }
});

export const selectMyListings = (state: RootState) =>
  state.listing.myListings.data;
export const selectMyListingsStatus = (state: RootState) =>
  state.listing.myListings.status;
export const selectMyListingsIsLoading = (state: RootState) =>
  state.listing.myListings.status === 'LOADING';
export const selectMyListingsError = (state: RootState) =>
  state.listing.myListings.error;
export const selectMyListingCreators = (state: RootState) =>
  state.listing.myListingCreators.data;
export const selectMyListingCreatorsStatus = (state: RootState) =>
  state.listing.myListingCreators.status;
export const selectMyListingCreatorsIsLoading = (state: RootState) =>
  state.listing.myListingCreators.status === 'LOADING';
export const selectMyListingCreatorsError = (state: RootState) =>
  state.listing.myListingCreators.error;

export default listingSlice.reducer;
