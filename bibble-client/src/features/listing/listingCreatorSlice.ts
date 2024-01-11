import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, store } from '../../store';
import {
  Breed,
  Country,
  HairCoat,
  LegalTag,
  SaleType,
  Size,
  Species,
  Vaccine
} from './types';
import axios from 'axios';
import { User } from '../user/types';
import { Gender, Media, StatusType } from '../types';
import { ListingCreator } from './types';

interface ListingCreatorState extends ListingCreator {
  status: StatusType;
  error?: string;
}

const initialState: ListingCreatorState = {
  stage: 0,
  status: 'DEFAULT',
  error: undefined
};

export const createListingCreator = createAsyncThunk(
  '/listingCreator/createListingCreator',
  async (payload: { currentUser: User; saleType: SaleType }) => {
    return await axios
      .post('/kennel/listing-creator', {
        saleType: payload.saleType
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const createListing = createAsyncThunk(
  '/listingCreator/createListing',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { _id } = state.listingCreator;
    return await axios
      .post(`/kennel/listing-creator/${_id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const fetchListingCreatorById = createAsyncThunk(
  '/listingCreator/fetchListingCreatorById',
  async (listingId: string) => {
    return await axios
      .get(`/kennel/listing-creator/${listingId}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateListingCreator = createAsyncThunk(
  '/listingCreator/updateListingCreator',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { media, ...listingCreator } = state.listingCreator;

    return await axios
      .put(`/kennel/listing-creator`, listingCreator)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateBiology = createAsyncThunk(
  '/listingCreator/updateBiology',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { _id, biology } = state.listingCreator;
    return await axios
      .put('/kennel/listing-creator/biology', {
        _id,
        stage: 1,
        biology
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateBiography = createAsyncThunk(
  '/listingCreator/updateBiography',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { _id, biography } = state.listingCreator;
    return await axios
      .put('/kennel/listing-creator/biography', {
        _id,
        stage: 2,
        biography
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateMedical = createAsyncThunk(
  '/listingCreator/updateMedical',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { _id, medical } = state.listingCreator;
    return await axios
      .put('/kennel/listing-creator/medical', {
        _id,
        stage: 3,
        medical
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateLegal = createAsyncThunk(
  '/listingCreator/updateLegal',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { _id, legal } = state.listingCreator;
    return await axios
      .put('/kennel/listing-creator/legal', {
        _id,
        stage: 4,
        legal
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateMedia = createAsyncThunk(
  '/listingCreator/updateMedia',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { _id, media } = state.listingCreator;

    if (!_id || !media) {
      return;
    }

    const formData = new FormData();
    formData.append('_id', _id);
    formData.append('stage', '5');
    media.forEach((media) => {
      media.name && formData.append('mediaNames[]', media.name);
    });
    media.forEach((media) => {
      media.file && formData.append('data', media.file);
    });
    return await axios
      .put('/kennel/listing-creator/media', formData, {
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

export const updatePrice = createAsyncThunk(
  '/listingCreator/updatePrice',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { price } = state.listingCreator;
    return await axios
      .put('/kennel/listing-creator/price', {
        _id: state.listingCreator._id,
        stage: 6,
        price
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const deleteListingCreatorById = createAsyncThunk(
  '/listingCreator/deleteListingCreatorById',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { _id } = state.listingCreator;

    return await axios
      .delete(`/kennel/listing-creator/${_id}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

const listingCreatorSlice = createSlice({
  name: 'listingCreator',
  initialState,
  reducers: {
    setSpecies: (state, action: PayloadAction<Species>) => {
      if (!state.biology) {
        state.biology = {};
      }
      state.biology.speciesId = action.payload._id;
      state.biology.species = action.payload;
      state.biology.breedIds = undefined;
      state.biology.breeds = undefined;
    },
    addBreed: (state, action: PayloadAction<Breed>) => {
      if (!state.biology) {
        state.biology = {};
      }
      if (!state.biology.breedIds) {
        state.biology.breedIds = [];
      }
      if (!state.biology.breeds) {
        state.biology.breeds = [];
      }
      state.biology.breedIds.push(action.payload._id!);
      state.biology.breeds.push(action.payload);
    },
    removeBreed: (state, action: PayloadAction<Breed>) => {
      if (!state.biology) {
        state.biology = {};
      }
      if (!state.biology.breedIds) {
        state.biology.breedIds = [];
      }
      if (!state.biology.breeds) {
        state.biology.breeds = [];
      }
      state.biology.breedIds = state.biology.breedIds.filter(
        (breedId) => breedId !== action.payload._id
      );
      state.biology.breeds = state.biology.breeds.filter(
        (breed) => breed._id !== action.payload._id
      );
    },
    setName: (state, action: PayloadAction<string>) => {
      if (!state.biography) {
        state.biography = {};
      }
      state.biography.name = action.payload;
    },
    setOrigin: (state, action: PayloadAction<Country>) => {
      if (!state.biography) {
        state.biography = {};
      }
      state.biography.originId = action.payload._id;
      state.biography.origin = action.payload;
    },
    setGender: (state, action: PayloadAction<Gender>) => {
      if (!state.biography) {
        state.biography = {};
      }
      state.biography.gender = action.payload;
    },
    setBirthdate: (state, action: PayloadAction<string>) => {
      if (!state.biography) {
        state.biography = {};
      }
      state.biography.birthdate = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      if (!state.biography) {
        state.biography = {};
      }
      state.biography.description = action.payload;
    },
    setSize: (state, action: PayloadAction<Size>) => {
      if (!state.medical) {
        state.medical = {};
      }
      state.medical.size = action.payload;
    },
    setWeight: (state, action: PayloadAction<number | ''>) => {
      if (!state.medical) {
        state.medical = {};
      }

      state.medical.weight = action.payload === '' ? undefined : action.payload;
    },
    setHairCoat: (state, action: PayloadAction<HairCoat>) => {
      if (!state.medical) {
        state.medical = {};
      }
      state.medical.hairCoatId = action.payload._id;
      state.medical.hairCoat = action.payload;
    },
    addVaccination: (state, action: PayloadAction<Vaccine>) => {
      if (!state.medical) {
        state.medical = {};
      }
      if (!state.medical.vaccineIds) {
        state.medical.vaccineIds = [];
      }
      if (!state.medical.vaccines) {
        state.medical.vaccines = [];
      }
      state.medical.vaccineIds.push(action.payload._id!);
      state.medical.vaccines.push(action.payload);
    },
    removeVaccination: (state, action: PayloadAction<Vaccine>) => {
      if (!state.medical) {
        state.medical = {};
      }
      if (!state.medical.vaccineIds) {
        state.medical.vaccineIds = [];
      }
      if (!state.medical.vaccines) {
        state.medical.vaccines = [];
      }
      state.medical.vaccineIds = state.medical.vaccineIds.filter(
        (vaccineId) => vaccineId !== action.payload._id
      );
      state.medical.vaccines = state.medical.vaccines.filter(
        (vaccine) => vaccine._id !== action.payload._id
      );
    },
    setAvsLicenseNumber: (state, action: PayloadAction<string>) => {
      if (!state.legal) {
        state.legal = {};
      }
      state.legal.avsLicenseNumber = action.payload;
    },
    addLegalTag: (state, action: PayloadAction<LegalTag>) => {
      if (!state.legal) {
        state.legal = {};
      }
      if (!state.legal.legalTagIds) {
        state.legal.legalTagIds = [];
      }
      if (!state.legal.legalTags) {
        state.legal.legalTags = [];
      }
      state.legal.legalTagIds.push(action.payload._id!);
      state.legal.legalTags.push(action.payload);
    },
    removeLegalTag: (state, action: PayloadAction<LegalTag>) => {
      if (!state.legal) {
        state.legal = {};
      }
      if (!state.legal.legalTagIds) {
        state.legal.legalTagIds = [];
      }
      if (!state.legal.legalTags) {
        state.legal.legalTags = [];
      }
      state.legal.legalTagIds = state.legal.legalTagIds.filter(
        (legalTagId) => legalTagId !== action.payload._id
      );
      state.legal.legalTags = state.legal.legalTags.filter(
        (legalTag) => legalTag._id !== action.payload._id
      );
    },
    addMedia: (state, action: PayloadAction<Media[]>) => {
      if (!state.media) {
        state.media = [];
      }
      state.media.push(...action.payload);
    },
    removeMedia: (state, action: PayloadAction<Media>) => {
      if (!state.media) {
        state.media = [];
      }
      state.media = state.media.filter(
        (media) => media.url !== action.payload.url
      );
    },
    setPrice: (state, action: PayloadAction<number | ''>) => {
      state.price = action.payload === '' ? undefined : action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListingCreatorById.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(fetchListingCreatorById.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        setState(state, action);
      })
      .addCase(fetchListingCreatorById.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(createListingCreator.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(createListingCreator.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state._id = action.payload._id;
        setState(state, action);
      })
      .addCase(createListingCreator.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updateBiology.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(updateBiology.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        setState(state, action);
      })
      .addCase(updateBiology.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updateBiography.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(updateBiography.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        setState(state, action);
      })
      .addCase(updateBiography.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updateMedical.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(updateMedical.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        setState(state, action);
      })
      .addCase(updateMedical.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updateLegal.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(updateLegal.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        setState(state, action);
      })
      .addCase(updateLegal.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updateMedia.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(updateMedia.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        setState(state, action);
      })
      .addCase(updateMedia.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updatePrice.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(updatePrice.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        setState(state, action);
      })
      .addCase(updatePrice.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(createListing.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        resetState(state);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(updateListingCreator.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(updateListingCreator.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        resetState(state);
      })
      .addCase(updateListingCreator.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      })
      .addCase(deleteListingCreatorById.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(deleteListingCreatorById.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        resetState(state);
      })
      .addCase(deleteListingCreatorById.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      });
  }
});

const setState = (state: any, action: any) => {
  state._id = action.payload._id;
  state.stage = action.payload.stage;
  state.saleType = action.payload.saleType;
  state.lister = action.payload.lister;
  state.biology = action.payload.biology;
  state.biography = action.payload.biography;
  state.medical = action.payload.medical;
  state.legal = action.payload.legal;
  state.media = action.payload.media;
  state.price = action.payload.price;
};

const resetState = (state: any) => {
  state._id = undefined;
  state.stage = 0;
  state.saleType = undefined;
  state.lister = undefined;
  state.biology = undefined;
  state.biography = undefined;
  state.medical = undefined;
  state.legal = undefined;
  state.media = undefined;
  state.price = undefined;
};

export const {
  setSpecies,
  addBreed,
  removeBreed,
  setName,
  setOrigin,
  setGender,
  setBirthdate,
  setDescription,
  setSize,
  setWeight,
  setHairCoat,
  addVaccination,
  removeVaccination,
  setAvsLicenseNumber,
  addLegalTag,
  removeLegalTag,
  addMedia,
  removeMedia,
  setPrice
} = listingCreatorSlice.actions;

export const selectListingCreator = (state: RootState) => state.listingCreator;
export const selectListingCreatorSpecies = (state: RootState) =>
  state.listingCreator.biology?.species;
export const selectListingCreatorBreeds = (state: RootState) =>
  state.listingCreator.biology?.breeds;
export const selectListingCreatorName = (state: RootState) =>
  state.listingCreator.biography?.name;
export const selectListingCreatorOrigin = (state: RootState) =>
  state.listingCreator.biography?.origin;
export const selectListingCreatorGender = (state: RootState) =>
  state.listingCreator.biography?.gender;
export const selectListingCreatorBirthdate = (state: RootState) =>
  state.listingCreator.biography?.birthdate;
export const selectListingCreatorDescription = (state: RootState) =>
  state.listingCreator.biography?.description;
export const selectListingCreatorSize = (state: RootState) =>
  state.listingCreator.medical?.size;
export const selectListingCreatorWeight = (state: RootState) =>
  state.listingCreator.medical?.weight;
export const selectListingCreatorHairCoat = (state: RootState) =>
  state.listingCreator.medical?.hairCoat;
export const selectListingCreatorVaccines = (state: RootState) =>
  state.listingCreator.medical?.vaccines;
export const selectListingCreatorAvsLicenseNumber = (state: RootState) =>
  state.listingCreator.legal?.avsLicenseNumber;
export const selectListingCreatorLegalTags = (state: RootState) =>
  state.listingCreator.legal?.legalTags;
export const selectListingCreatorMedia = (state: RootState) =>
  state.listingCreator.media;
export const selectListingCreatorPrice = (state: RootState) =>
  state.listingCreator.price;
export const selectListingCreatorBiologyIsCompleted = (state: RootState) =>
  state.listingCreator.biology?.species !== undefined &&
  state.listingCreator.biology?.breeds !== undefined &&
  state.listingCreator.biology?.breeds.length > 0;
export const selectListingCreatorBiographyIsCompleted = (state: RootState) =>
  state.listingCreator.biography?.origin !== undefined &&
  state.listingCreator.biography?.gender !== undefined &&
  state.listingCreator.biography?.description !== undefined;
export const selectListingCreatorMedicalIsCompleted = (state: RootState) =>
  state.listingCreator.medical?.size !== undefined &&
  state.listingCreator.medical?.weight !== undefined &&
  state.listingCreator.medical?.hairCoat !== undefined &&
  state.listingCreator.medical?.vaccines !== undefined &&
  state.listingCreator.medical?.vaccines.length > 0;
export const selectListingCreatorLegalIsCompleted = (state: RootState) =>
  state.listingCreator.legal?.avsLicenseNumber !== undefined;
export const selectListingCreatorMediaIsCompleted = (state: RootState) =>
  state.listingCreator.media !== undefined &&
  state.listingCreator.media.length > 0;
export const selectListingCreatorPriceIsCompleted = (state: RootState) =>
  state.listingCreator.price !== undefined;
export const selectListingCreatorStatus = (state: RootState) =>
  state.listingCreator.status;
export const selectListingCreatorIsLoading = (state: RootState) =>
  state.listingCreator.status === 'LOADING';
export const selectListingCreatorError = (state: RootState) =>
  state.listingCreator.error;

export default listingCreatorSlice.reducer;
