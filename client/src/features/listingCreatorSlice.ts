import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, store } from '../store';
import {
  Breed,
  Country,
  Gender,
  HairCoat,
  LegalTag,
  ListingCreator,
  Media,
  SaleType,
  Size,
  Species,
  StatusType,
  User,
  Vaccine
} from '../types';
import axios from 'axios';

interface ListingCreatorState extends ListingCreator {
  status: StatusType;
  error?: string;
}

const initialState: ListingCreatorState = {
  stage: 0,
  status: 'DEFAULT',
  error: undefined
};

export const fetchListingCreatorById = createAsyncThunk(
  '/listingCreator/fetchListingCreatorById',
  async (listingId: string) => {
    return await axios
      .get(`/api/listing-creator/${listingId}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

export const updateListingCreatorById = createAsyncThunk(
  '/listingCreator/updateListingCreatorById',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { _id, stage, biology, biography, medical, legal, media, price } =
      state.listingCreator;

    return await axios
      .put(`/api/listing-creator/${_id}`, {
        stage,
        biology,
        biography,
        medical,
        legal,
        // Media not saveable,
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

export const createListingCreator = createAsyncThunk(
  '/listingCreator/createListingCreator',
  async (payload: { currentUser: User; saleType: SaleType }) => {
    return await axios
      .post('/api/listing-creator', {
        saleType: payload.saleType,
        lister: payload.currentUser._id
      })
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
    const { species, breeds } = state.listingCreator.biology || {};

    return await axios
      .post('/api/listing-creator/biology', {
        _id: state.listingCreator._id,
        stage: 1,
        species,
        breeds
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
    const { name, origin, gender, birthdate, description } =
      state.listingCreator.biography || {};

    return await axios
      .post('/api/listing-creator/biography', {
        _id: state.listingCreator._id,
        stage: 2,
        name,
        origin,
        gender,
        birthdate: birthdate || new Date(Date.now()),
        description
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
    const { size, weight, hairCoat, vaccines } =
      state.listingCreator.medical || {};

    return await axios
      .post('/api/listing-creator/medical', {
        _id: state.listingCreator._id,
        stage: 3,
        size,
        weight,
        hairCoat,
        vaccines
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
    const { avsLicenseNumber, legalTags } = state.listingCreator.legal || {};

    return await axios
      .post('/api/listing-creator/legal', {
        _id: state.listingCreator._id,
        stage: 4,
        avsLicenseNumber,
        legalTags
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
    const media = state.listingCreator.media || [];

    const formData = new FormData();
    formData.append('_id', state.listingCreator._id || '');
    formData.append('stage', '5');
    media.forEach((media) => {
      media.name && formData.append('mediaNames[]', media.name);
    });
    media.forEach((media) => {
      media.file && formData.append('data', media.file);
    });

    return await axios
      .post('/api/listing-creator/media', formData, {
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
    const price = state.listingCreator.price || 0;

    return await axios
      .post('/api/listing-creator/price', {
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

export const createListing = createAsyncThunk(
  '/listingCreator/createListing',
  async (_, { getState }) => {
    const state = getState() as RootState;

    return await axios
      .post('/api/listing-creator/submit', {
        listingCreatorId: state.listingCreator._id
      })
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
      state.biology.species = action.payload;
    },
    addBreed: (state, action: PayloadAction<Breed>) => {
      if (!state.biology) {
        state.biology = {};
      }
      if (!state.biology.breeds) {
        state.biology.breeds = [];
      }
      state.biology.breeds.push(action.payload);
    },
    removeBreed: (state, action: PayloadAction<Breed>) => {
      if (!state.biology) {
        state.biology = {};
      }
      if (!state.biology.breeds) {
        state.biology.breeds = [];
      }
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
      state.medical.hairCoat = action.payload;
    },
    addVaccination: (state, action: PayloadAction<Vaccine>) => {
      if (!state.medical) {
        state.medical = {};
      }
      if (!state.medical.vaccines) {
        state.medical.vaccines = [];
      }
      state.medical.vaccines.push(action.payload);
    },
    removeVaccination: (state, action: PayloadAction<Vaccine>) => {
      if (!state.medical) {
        state.medical = {};
      }
      if (!state.medical.vaccines) {
        state.medical.vaccines = [];
      }
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
      if (!state.legal.legalTags) {
        state.legal.legalTags = [];
      }
      state.legal.legalTags.push(action.payload);
    },
    removeLegalTag: (state, action: PayloadAction<LegalTag>) => {
      if (!state.legal) {
        state.legal = {};
      }
      if (!state.legal.legalTags) {
        state.legal.legalTags = [];
      }
      state.legal.legalTags = state.legal.legalTags.filter(
        (legalTag) => legalTag !== action.payload
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
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
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
export const selectListingCreatorStatus = (state: RootState) =>
  state.listingCreator.status;
export const selectListingCreatorError = (state: RootState) =>
  state.listingCreator.error;

export default listingCreatorSlice.reducer;
