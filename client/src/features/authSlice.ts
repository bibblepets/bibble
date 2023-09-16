import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { StatusType, User } from '../types';

interface AuthState {
  token?: string;
  isAuthenticated: boolean;
  currentUser?: User;
  status: StatusType;
  error?: string;
  message?: string;
}

const initialState: AuthState = {
  token: undefined,
  isAuthenticated: false,
  currentUser: undefined,
  status: 'DEFAULT',
  error: undefined,
  message: undefined
};

axios.defaults.withCredentials = true;

export const checkAuthStatus = createAsyncThunk(
  '/authSlice/checkAuthStatus',
  async () => {
    const response = await axios.get('/api/auth/status');
    return response.data;
  }
);
export const authenticateUser = createAsyncThunk(
  '/authSlice/authenticateUser',
  async (credentials: {
    type: string;
    name?: string;
    email: string;
    password: string;
  }) => {
    const response = await axios.post('/api/auth/authenticate', credentials);
    return response.data;
  }
);
export const logoutUser = createAsyncThunk(
  '/authSlice/logoutUser',
  async () => {
    const response = await axios.post('/api/auth/logout');
    return response.data;
  }
);

export const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.isAuthenticated = action.payload.isAuthenticated;
        state.currentUser = action.payload.currentUser;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(authenticateUser.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.isAuthenticated = action.payload.isAuthenticated;
        state.currentUser = action.payload.currentUser;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.isAuthenticated = action.payload.isAuthenticated;
        state.currentUser = undefined;
        state.token = undefined;
        state.message = action.payload.message;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      });
  }
});

export const selectCurrentUser = (state: RootState) =>
  state.authentication.currentUser;
export const selectIsAuthenticated = (state: RootState) =>
  state.authentication.isAuthenticated;
export const selectAuthStatus = (state: RootState) =>
  state.authentication.status;

export default authSlice.reducer;
