import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { StatusType, User } from '../../types';

interface AuthState {
  currentUser?: User;
  status: StatusType;
  error?: string;
}

const initialState: AuthState = {
  currentUser: undefined,
  status: 'DEFAULT',
  error: undefined
};

export const fetchCurrentUser = createAsyncThunk(
  '/users/fetchCurrentUser',
  async () => {
    const response = await axios.get('/api/users/currentUser');
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state, action) => {
        state.status = 'LOADING';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      });
  }
});

export const selectCurrentUser = (state: RootState) =>
  state.authentication.currentUser;

export default authSlice.reducer;
