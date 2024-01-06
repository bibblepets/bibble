import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState, store } from '../store';
import {
  BusinessProfile,
  BuyerProfile,
  Media,
  StatusType,
  User
} from '../types';

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

axios.defaults.withCredentials = true;

export const authenticate = createAsyncThunk(
  '/userSlice/authenticate',
  async () => {
    return await axios
      .get('/user/auth')
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
      .post('/user/auth/register', credentials)
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
  async (
    credentials: Omit<
      User,
      '_id' | 'createdAt' | 'updatedAt' | 'buyerProfile' | 'businessProfile'
    >
  ) => {
    return await axios
      .post('/kennel/auth/login', credentials)
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
      .post('/kennel/auth/logout')
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
  async (user: Partial<User>) => {
    return await axios
      .put('/kennel/user', user)
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
      .put('/kennel/user/profile-picture', formData, {
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
        state.currentUser = action.payload.user;
        state.message = action.payload.message;
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
        state.currentUser = action.payload.user;
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
        state.currentUser = action.payload.user;
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
        state.status = 'DEFAULT';
        state.currentUser = undefined;
        state.message = action.payload.message;
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
        state.currentUser = action.payload.user;
        state.message = action.payload.message;
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
        state.currentUser = action.payload.user;
        state.message = action.payload.message;
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
  (state.user.currentUser?.buyerProfile?.firstName || '') +
  ' ' +
  (state.user.currentUser?.buyerProfile?.lastName || '');
export const selectUserPersonalEmail = (state: RootState) =>
  state.user.currentUser?.email;
export const selectUserPersonalContact = (state: RootState) =>
  state.user.currentUser?.buyerProfile?.contactNumber;
export const selectUserPersonalAddress = (state: RootState) =>
  state.user.currentUser?.buyerProfile?.address;
export const selectUserBio = (state: RootState) =>
  state.user.currentUser?.buyerProfile?.bio;

export default userSlice.reducer;
