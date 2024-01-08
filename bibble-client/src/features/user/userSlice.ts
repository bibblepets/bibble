import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { StatusType } from '../../types';
import { User } from './types';
import { Media } from '../types';

const USER_API_URL = import.meta.env.VITE_USER_API_URL;

axios.defaults.withCredentials = true;

interface UserState {
  currentUser?: User;
  status: StatusType;
  error?: string;
  message?: string;
}

const initialState: UserState = {
  currentUser: undefined,
  status: 'DEFAULT',
  error: undefined,
  message: undefined
};

export const authenticate = createAsyncThunk(
  '/userSlice/authenticate',
  async () => {
    return await axios
      .get(`${USER_API_URL}/auth`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const registerUser = createAsyncThunk(
  '/userSlice/register',
  async (credentials: User) => {
    return await axios
      .post(`${USER_API_URL}/auth/register`, credentials)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const loginUser = createAsyncThunk(
  '/userSlice/loginUser',
  async (credentials: User) => {
    return await axios
      .post(`${USER_API_URL}/auth/login`, credentials)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const logoutUser = createAsyncThunk(
  '/userSlice/logoutUser',
  async () => {
    return await axios
      .post(`${USER_API_URL}/auth/logout`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateUser = createAsyncThunk(
  '/userSlice/updateUser',
  async (updates: Partial<User>) => {
    return await axios
      .put(`${USER_API_URL}/user`, updates)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateProfilePicture = createAsyncThunk(
  '/userSlice/updateProfilePicture',
  async (profilePic: Media) => {
    const formData = new FormData();
    profilePic.name && formData.append('profilePic', profilePic.name);
    profilePic.file && formData.append('data', profilePic.file);

    return await axios
      .put(`${USER_API_URL}/user/profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const userSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'DEFAULT';
      state.error = undefined;
      state.message = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(authenticate.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.currentUser = action.payload;
      })
      .addCase(authenticate.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.currentUser = action.payload;
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
        state.currentUser = action.payload;
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
        state.status = 'DEFAULT';
        state.currentUser = undefined;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.currentUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updateProfilePicture.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.currentUser = action.payload;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      });
  }
});

export const { resetStatus } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectIsAuthenticated = (state: RootState) =>
  !!state.user.currentUser;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserIsLoading = (state: RootState) =>
  state.user.status === 'LOADING';
export const selectUserPersonalName = (state: RootState) =>
  (state.user.currentUser?.firstName || '') +
  ' ' +
  (state.user.currentUser?.lastName || '');
export const selectUserPersonalEmail = (state: RootState) =>
  state.user.currentUser?.email;
export const selectUserPersonalContact = (state: RootState) =>
  state.user.currentUser?.contactNumber;
export const selectUserPersonalAddress = (state: RootState) =>
  state.user.currentUser?.address;
export const selectUserBio = (state: RootState) => state.user.currentUser?.bio;

export default userSlice.reducer;
