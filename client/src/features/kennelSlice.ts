import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { Listing, StatusType } from '../types';

interface KennelState {
  listings: Listing[];
  status: StatusType;
  error?: string;
}

const initialState: KennelState = {
  listings: [],
  status: 'DEFAULT',
  error: undefined
};

export const fetchListings = createAsyncThunk(
  '/kennelSlice/fetchListings',
  async () => {
    return await axios
      .get('/api/pet-listings')
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

const kennelSlice = createSlice({
  name: 'kennelSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchListings.pending, (state) => {
      state.status = 'LOADING';
    });
    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.listings = action.payload;
    });
    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
  }
});

export const selectKennelListings = (state: RootState) => state.kennel.listings;
export const selectKennelStatus = (state: RootState) => state.kennel.status;
export const selectKennelError = (state: RootState) => state.kennel.error;
export const selectListingById = (id: string) => (state: RootState) =>
  state.kennel.listings?.find((listing) => listing._id === id);

export default kennelSlice.reducer;
