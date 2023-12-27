import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  Country,
  Gender,
  HairCoat,
  LegalTag,
  Listing,
  Media,
  Size,
  StatusType,
  Vaccine
} from '../types';
import { RootState } from '../store';
import axios from 'axios';

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
  async (id: string) => {
    return await axios
      .get(`/api/listings/${id}`)
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
    const { listing } = state.listingEditor;

    return await axios
      .put(`/api/listings/update/${listing?._id}`, listing)
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
    const { listing } = state.listingEditor;

    const formData = new FormData();
    listing?.media.forEach((media) => {
      media.name && formData.append('mediaNames[]', media.name);
    });
    listing?.media.forEach((media) => {
      media.file && formData.append('data', media.file);
    });

    return await axios
      .put(`/api/listings/update-media/${listing?._id}`, formData, {
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
      if (state.listing && state.listing.animal) {
        state.listing.animal.origin = action.payload;
      }
    },
    setGender: (state, action: PayloadAction<Gender>) => {
      if (state.listing && state.listing.animal) {
        state.listing.animal.gender = action.payload;
      }
    },
    setName: (state, action: PayloadAction<string>) => {
      if (state.listing && state.listing.animal) {
        state.listing.animal.name = action.payload;
      }
    },
    setBirthdate: (state, action: PayloadAction<string>) => {
      if (state.listing && state.listing.animal) {
        state.listing.animal.birthdate = new Date(action.payload);
      }
    },
    setDescription: (state, action: PayloadAction<string>) => {
      if (state.listing) {
        state.listing.description = action.payload;
      }
    },
    setSize: (state, action: PayloadAction<Size>) => {
      if (state.listing && state.listing.animal) {
        state.listing.animal.size = action.payload;
      }
    },
    setWeight: (state, action: PayloadAction<number>) => {
      if (state.listing && state.listing.animal) {
        state.listing.animal.weight = action.payload;
      }
    },
    setHairCoat: (state, action: PayloadAction<HairCoat>) => {
      if (state.listing && state.listing.animal) {
        state.listing.animal.hairCoat = action.payload;
      }
    },
    addVaccination: (state, action: PayloadAction<Vaccine>) => {
      if (state.listing && state.listing.animal) {
        state.listing.animal.vaccines.push(action.payload);
      }
    },
    removeVaccination: (state, action: PayloadAction<Vaccine>) => {
      if (state.listing && state.listing.animal) {
        state.listing.animal.vaccines = state.listing.animal.vaccines.filter(
          (vaccine) => vaccine._id !== action.payload._id
        );
      }
    },
    setAvsLicenseNumber: (state, action: PayloadAction<string>) => {
      if (state.listing && state.listing.animal) {
        state.listing.animal.avsLicenseNumber = action.payload;
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
    // TODO: Find a more elegant solution to this
    addLegalTag: (state, action: PayloadAction<LegalTag>) => {
      if (state.listing && state.listing.animal) {
        switch (action.payload) {
          case 'isHypoallergenic':
            state.listing.animal.isHypoallergenic = true;
            break;
          case 'isMicrochipped':
            state.listing.animal.isMicrochipped = true;
            break;
          case 'isNeutered':
            state.listing.animal.isNeutered = true;
            break;
          case 'isHdbApproved':
            state.listing.animal.isHdbApproved = true;
            break;
          default:
            break;
        }
      }
    },
    // TODO: Find a more elegant solution to this
    removeLegalTag: (state, action: PayloadAction<LegalTag>) => {
      if (state.listing && state.listing.animal) {
        switch (action.payload) {
          case 'isHypoallergenic':
            state.listing.animal.isHypoallergenic = false;
            break;
          case 'isMicrochipped':
            state.listing.animal.isMicrochipped = false;
            break;
          case 'isNeutered':
            state.listing.animal.isNeutered = false;
            break;
          case 'isHdbApproved':
            state.listing.animal.isHdbApproved = false;
            break;
          default:
            break;
        }
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
        state.listing = action.payload.listing;
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
        state.listing = action.payload.listing;
      })
      .addCase(updateListingMediaById.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      });
  }
});

export const {
  setOrigin,
  setGender,
  setName,
  setBirthdate,
  setDescription,
  setSize,
  setWeight,
  setHairCoat,
  addVaccination,
  removeVaccination,
  addMedia,
  removeMedia,
  setAvsLicenseNumber,
  addLegalTag,
  removeLegalTag,
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
export const selectListingEditorAnimal = (state: RootState) =>
  state.listingEditor.listing?.animal;
export const selectListingEditorSpecies = (state: RootState) =>
  state.listingEditor.listing?.species;
export const selectListingEditorBreeds = (state: RootState) =>
  state.listingEditor.listing?.animal?.breeds;
export const selectListingEditorVaccines = (state: RootState) =>
  state.listingEditor.listing?.animal?.vaccines;
export const selectListingEditorOrigin = (state: RootState) =>
  state.listingEditor.listing?.animal?.origin;
export const selectListingEditorName = (state: RootState) =>
  state.listingEditor.listing?.animal?.name;
export const selectListingEditorGender = (state: RootState) =>
  state.listingEditor.listing?.animal?.gender;
export const selectListingEditorBirthdate = (state: RootState) =>
  state.listingEditor.listing?.animal?.birthdate;
export const selectListingEditorSize = (state: RootState) =>
  state.listingEditor.listing?.animal?.size;
export const selectListingEditorWeight = (state: RootState) =>
  state.listingEditor.listing?.animal?.weight;
export const selectListingEditorHairCoat = (state: RootState) =>
  state.listingEditor.listing?.animal?.hairCoat;
export const selectListingEditorAvsLicenseNumber = (state: RootState) =>
  state.listingEditor.listing?.animal?.avsLicenseNumber;
export const selectListingEditorLegalTags = (state: RootState): string[] => {
  const animal = state.listingEditor.listing?.animal;
  const legalTags: string[] = [];

  if (animal?.isHypoallergenic) {
    legalTags.push('isHypoallergenic');
  }
  if (animal?.isMicrochipped) {
    legalTags.push('isMicrochipped');
  }
  if (animal?.isNeutered) {
    legalTags.push('isNeutered');
  }
  if (animal?.isHdbApproved) {
    legalTags.push('isHdbApproved');
  }

  return legalTags;
};
export const selectListingEditorStatus = (state: RootState) =>
  state.listingEditor.status;
export const selectListingEditorIsLoading = (state: RootState) =>
  state.listingEditor.status === 'LOADING';
export const selectListingEditorError = (state: RootState) =>
  state.listingEditor.error;

export default listingEditorSlice.reducer;
