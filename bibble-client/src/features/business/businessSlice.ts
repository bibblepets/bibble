import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { Media, StatusType } from '../types';
import { Business } from './types';

axios.defaults.withCredentials = true;

interface BusinessState {
  currentBusiness?: Business;
  status: StatusType;
  error?: string;
  message?: string;
}

const initialState: BusinessState = {
  currentBusiness: undefined,
  status: 'DEFAULT',
  error: undefined,
  message: undefined
};

export const authenticateBusiness = createAsyncThunk(
  '/businessSlice/authenticate',
  async () => {
    return await axios
      .get(`/api/user/business/auth`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const registerBusiness = createAsyncThunk(
  '/businessSlice/register',
  async (credentials: Partial<Business>) => {
    return await axios
      .post(`/api/user/business/register`, credentials)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const loginBusiness = createAsyncThunk(
  '/businessSlice/login',
  async (credentials: Partial<Business>) => {
    return await axios
      .post(`/api/user/business/login`, credentials)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const logoutBusiness = createAsyncThunk(
  '/businessSlice/logout',
  async () => {
    return await axios
      .post(`/api/user/business/logout`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateBusinessMedia = createAsyncThunk(
  '/businessSlice/updateBusinessMedia',
  async (media: Media[]) => {
    const formData = new FormData();
    media.forEach((media) => {
      media.name && formData.append('media[]', media.name);
    });
    media.forEach((media) => {
      media.file && formData.append('data', media.file);
    });

    return await axios
      .put(`/api/user/business/media`, formData, {
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

export const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(authenticateBusiness.pending, (state) => {
      state.status = 'LOADING';
      state.error = undefined;
    });
    builder.addCase(authenticateBusiness.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.currentBusiness = action.payload;
    });
    builder.addCase(authenticateBusiness.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
    builder.addCase(registerBusiness.pending, (state) => {
      state.status = 'LOADING';
      state.error = undefined;
    });
    builder.addCase(registerBusiness.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.currentBusiness = action.payload;
    });
    builder.addCase(registerBusiness.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
    builder.addCase(loginBusiness.pending, (state) => {
      state.status = 'LOADING';
      state.error = undefined;
    });
    builder.addCase(loginBusiness.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.currentBusiness = action.payload;
    });
    builder.addCase(loginBusiness.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
    builder.addCase(logoutBusiness.pending, (state) => {
      state.status = 'LOADING';
      state.error = undefined;
    });
    builder.addCase(logoutBusiness.fulfilled, (state, action) => {
      state.status = 'SUCCESS';
      state.currentBusiness = undefined;
    });
    builder.addCase(logoutBusiness.rejected, (state, action) => {
      state.status = 'ERROR';
      state.error = action.error.message;
    });
  }
});

export const selectCurrentBusiness = (state: RootState) =>
  state.business.currentBusiness;
export const selectBusinessStatus = (state: RootState) => state.business.status;
export const selectBusinessError = (state: RootState) => state.business.error;

export default businessSlice.reducer;
