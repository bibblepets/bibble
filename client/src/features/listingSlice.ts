import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Listing, ListingCreator, StatusType } from '../types';
import axios from 'axios';
import { RootState } from '../store';

interface ListingState {
  myListings: Listing[];
  myListingCreators: ListingCreator[];
  status: StatusType;
  error?: string;
}

const initialState: ListingState = {
  myListings: [],
  myListingCreators: [],
  status: 'DEFAULT',
  error: undefined
};

export const fetchMyListings = createAsyncThunk(
  '/listingSlice/fetchMyListings',
  async () => {
    return await axios
      .get('/api/listings/my-listings') // TODO TITUS
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
      .get('/api/listing-creator/my-listing-creators') // TODO TITUS
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
      state.status = 'LOADING';
    });
    builder.addCase(fetchMyListings.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.myListings = action.payload;
    });
    builder.addCase(fetchMyListings.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
    builder.addCase(fetchMyListingCreators.pending, (state) => {
      state.status = 'LOADING';
    });
    builder.addCase(fetchMyListingCreators.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.myListingCreators = action.payload;
    });
    builder.addCase(fetchMyListingCreators.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
  }
});

export const selectMyListings = (state: RootState) => state.listing.myListings;
export const selectMyListingCreators = (state: RootState) =>
  state.listing.myListingCreators;
export const selectListingStatus = (state: RootState) => state.listing.status;
export const selectListingError = (state: RootState) => state.listing.error;

export default listingSlice.reducer;
