import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { Gender, Media, StatusType } from '../types';
import {
  Breed,
  Country,
  HairCoat,
  LegalTag,
  Listing,
  Size,
  Vaccine
} from './types';

interface ListingEditorState {
  listing?: Listing;
  status: StatusType;
  error?: string;
}

const initialState: ListingEditorState = {
  status: 'DEFAULT'
};

export const fetchListingById = createAsyncThunk(
  'listingEditor/fetchListingById',
  async (_id: string) => {
    return await axios
      .get(`/api/kennel/listing/${_id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateListingById = createAsyncThunk(
  'listingEditor/updateListingById',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { _id, media, ...listing } = state.listingEditor.listing || {};

    return await axios
      .put(`/api/kennel/listing/${_id}`, listing)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateListingMediaById = createAsyncThunk(
  'listingEditor/updateListingMediaById',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { _id, media } = state.listingEditor.listing || {};

    if (!_id || !media) {
      return;
    }

    const formData = new FormData();
    formData.append('_id', _id);
    media.forEach((media) => {
      media.name && formData.append('media[]', media.name);
    });
    media.forEach((media) => {
      media.file && formData.append('data', media.file);
    });

    return await axios
      .put(`/api/kennel/listing/media/${_id}`, formData, {
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

const listingEditorSlice = createSlice({
  name: 'listingEditor',
  initialState,
  reducers: {
    setOrigin: (state, action: PayloadAction<Country>) => {
      if (state.listing && action.payload._id) {
        state.listing.originId = action.payload._id;
        state.listing.origin = action.payload;
      }
    },
    addBreed: (state, action: PayloadAction<Breed>) => {
      if (state.listing && action.payload._id) {
        state.listing.breedIds?.push(action.payload._id);
        state.listing.breeds?.push(action.payload);
      }
    },
    removeBreed: (state, action: PayloadAction<Breed>) => {
      if (state.listing) {
        state.listing.breedIds = state.listing.breedIds?.filter(
          (breedId) => breedId !== action.payload._id
        );
        state.listing.breeds = state.listing.breeds?.filter(
          (breed) => breed._id !== action.payload._id
        );
      }
    },
    setGender: (state, action: PayloadAction<Gender>) => {
      if (state.listing) {
        state.listing.gender = action.payload;
      }
    },
    setName: (state, action: PayloadAction<string>) => {
      if (state.listing) {
        state.listing.name = action.payload;
      }
    },
    setBirthdate: (state, action: PayloadAction<string>) => {
      if (state.listing) {
        state.listing.birthdate = new Date(action.payload);
      }
    },
    setDescription: (state, action: PayloadAction<string>) => {
      if (state.listing) {
        state.listing.description = action.payload;
      }
    },
    setSize: (state, action: PayloadAction<Size>) => {
      if (state.listing) {
        state.listing.size = action.payload;
      }
    },
    setWeight: (state, action: PayloadAction<number>) => {
      if (state.listing) {
        state.listing.weight = action.payload;
      }
    },
    setHairCoat: (state, action: PayloadAction<HairCoat>) => {
      if (state.listing && action.payload._id) {
        state.listing.hairCoatId = action.payload._id;
        state.listing.hairCoat = action.payload;
      }
    },
    addVaccination: (state, action: PayloadAction<Vaccine>) => {
      if (state.listing && action.payload._id) {
        state.listing.vaccineIds.push(action.payload._id);
        state.listing.vaccines?.push(action.payload);
      }
    },
    removeVaccination: (state, action: PayloadAction<Vaccine>) => {
      if (state.listing) {
        state.listing.vaccineIds = state.listing.vaccineIds.filter(
          (vaccineId) => vaccineId !== action.payload._id
        );
        state.listing.vaccines = state.listing.vaccines?.filter(
          (vaccine) => vaccine._id !== action.payload._id
        );
      }
    },
    addLegalTag: (state, action: PayloadAction<LegalTag>) => {
      if (state.listing && action.payload._id) {
        state.listing.legalTagIds.push(action.payload._id);
        state.listing.legalTags?.push(action.payload);
      }
    },
    removeLegalTag: (state, action: PayloadAction<LegalTag>) => {
      if (state.listing) {
        state.listing.legalTagIds = state.listing.legalTagIds.filter(
          (legalTagId) => legalTagId !== action.payload._id
        );
        state.listing.legalTags = state.listing.legalTags?.filter(
          (legalTag) => legalTag._id !== action.payload._id
        );
      }
    },
    setAvsLicenseNumber: (state, action: PayloadAction<string>) => {
      if (state.listing) {
        state.listing.avsLicenseNumber = action.payload;
      }
    },
    addMedia: (state, action: PayloadAction<Media[]>) => {
      if (state.listing) {
        state.listing.media.push(...action.payload);
      }
    },
    removeMedia: (state, action: PayloadAction<Media[]>) => {
      if (state.listing) {
        state.listing.media = state.listing.media.filter(
          (media) =>
            !action.payload.some(
              (payloadMedia) => payloadMedia.url === media.url
            )
        );
      }
    },
    setPrice: (state, action: PayloadAction<number>) => {
      if (state.listing) {
        state.listing.price = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListingById.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.listing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updateListingById.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(updateListingById.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.listing = action.payload;
      })
      .addCase(updateListingById.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updateListingMediaById.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(updateListingMediaById.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state.listing = action.payload;
      })
      .addCase(updateListingMediaById.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      });
  }
});

export const {
  setOrigin,
  addBreed,
  removeBreed,
  setGender,
  setName,
  setBirthdate,
  setDescription,
  setSize,
  setWeight,
  setHairCoat,
  addVaccination,
  removeVaccination,
  addLegalTag,
  removeLegalTag,
  addMedia,
  removeMedia,
  setAvsLicenseNumber,
  setPrice
} = listingEditorSlice.actions;

export const selectListingEditorListing = (state: RootState) =>
  state.listingEditor.listing;
export const selectListingEditorPrice = (state: RootState) =>
  state.listingEditor.listing?.price;
export const selectListingEditorDescription = (state: RootState) =>
  state.listingEditor.listing?.description;
export const selectListingEditorSaleType = (state: RootState) =>
  state.listingEditor.listing?.saleType;
export const selectListingEditorMedia = (state: RootState) =>
  state.listingEditor.listing?.media;
export const selectListingEditorSpecies = (state: RootState) =>
  state.listingEditor.listing?.species;
export const selectListingEditorBreeds = (state: RootState) =>
  state.listingEditor.listing?.breeds;
export const selectListingEditorVaccines = (state: RootState) =>
  state.listingEditor.listing?.vaccines;
export const selectListingEditorLegalTags = (state: RootState) =>
  state.listingEditor.listing?.legalTags;
export const selectListingEditorOrigin = (state: RootState) =>
  state.listingEditor.listing?.origin;
export const selectListingEditorName = (state: RootState) =>
  state.listingEditor.listing?.name;
export const selectListingEditorGender = (state: RootState) =>
  state.listingEditor.listing?.gender;
export const selectListingEditorBirthdate = (state: RootState) =>
  state.listingEditor.listing?.birthdate;
export const selectListingEditorSize = (state: RootState) =>
  state.listingEditor.listing?.size;
export const selectListingEditorWeight = (state: RootState) =>
  state.listingEditor.listing?.weight;
export const selectListingEditorHairCoat = (state: RootState) =>
  state.listingEditor.listing?.hairCoat;
export const selectListingEditorAvsLicenseNumber = (state: RootState) =>
  state.listingEditor.listing?.avsLicenseNumber;
export const selectListingEditorStatus = (state: RootState) =>
  state.listingEditor.status;
export const selectListingEditorIsLoading = (state: RootState) =>
  state.listingEditor.status === 'LOADING';
export const selectListingEditorError = (state: RootState) =>
  state.listingEditor.error;

export default listingEditorSlice.reducer;
