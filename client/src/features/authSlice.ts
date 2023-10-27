import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { BusinessProfile, BuyerProfile, StatusType, User } from '../types';

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
    return await axios
      .get('/api/auth/status')
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const registerUser = createAsyncThunk(
  '/authSlice/registerUser',
  async (
    credentials: Omit<
      User,
      '_id' | 'createdAt' | 'updatedAt' | 'buyerProfile' | 'businessProfile'
    > & {
      buyerProfile: Omit<BuyerProfile, '_id' | 'createdAt' | 'updatedAt'>;
      businessProfile?: Omit<
        BusinessProfile,
        '_id' | 'createdAt' | 'updatedAt'
      >;
    }
  ) => {
    return await axios
      .post('api/auth/register', credentials)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const loginUser = createAsyncThunk(
  '/authSlice/loginUser',
  async (credentials: { email: string; password: string }) => {
    return await axios
      .post('api/auth/login', credentials)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const logoutUser = createAsyncThunk(
  '/authSlice/logoutUser',
  async () => {
    return await axios
      .post('/api/auth/logout')
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'DEFAULT';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.isAuthenticated = true;
        state.currentUser = action.payload.currentUser;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        if (action.error.message === 'Unauthorized.') {
          state.status = 'SUCCESS';
          state.isAuthenticated = false;
          state.currentUser = undefined;
          state.token = undefined;
          state.message = action.error.message;
        } else {
          state.status = 'ERROR';
          state.error = action.error.message;
        }
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.isAuthenticated = true;
        state.currentUser = action.payload.currentUser;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.isAuthenticated = action.payload.isAuthenticated;
        state.currentUser = action.payload.currentUser;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
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

export const { resetStatus } = authSlice.actions;

export const selectCurrentUser = (state: RootState) =>
  state.authentication.currentUser;
export const selectIsAuthenticated = (state: RootState) =>
  state.authentication.isAuthenticated;
export const selectAuthStatus = (state: RootState) =>
  state.authentication.status;

export default authSlice.reducer;
