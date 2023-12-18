import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, store } from '../store';
import {
  Breed,
  Country,
  Gender,
  HairCoat,
  LegalTag,
  Media,
  SaleType,
  Size,
  Species,
  StatusType,
  User,
  Vaccine
} from '../types';
import axios from 'axios';

interface ListingCreatorState {
  _id?: string;
  stage: number;
  saleType?: SaleType;
  lister?: User;
  biology?: {
    species?: Species;
    breeds?: Breed[];
  };
  biography?: {
    origin?: Country;
    gender?: Gender;
    birthdate?: string;
    description?: string;
  };
  medical?: {
    size?: Size;
    weight?: number;
    hairCoat?: HairCoat;
    vaccines?: Vaccine[];
  };
  legal?: {
    avsLicenseNumber?: string;
    legalTags?: LegalTag[];
  };
  media?: Media[];
  price?: number;

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

export const initListingCreator = createAsyncThunk(
  '/listingCreator/initListingCreator',
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
    const { origin, gender, birthdate, description } =
      state.listingCreator.biography || {};

    return await axios
      .post('/api/listing-creator/biography', {
        _id: state.listingCreator._id,
        stage: 2,
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

    // TODO TITUS
    return await axios
      .get(`/api/listing-creator/${state.listingCreator._id}`)
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

export const submitListing = createAsyncThunk(
  '/listingCreator/submitListing',
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
    setWeight: (state, action: PayloadAction<number>) => {
      if (!state.medical) {
        state.medical = {};
      }
      state.medical.weight = action.payload;
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
      .addCase(initListingCreator.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(initListingCreator.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        state._id = action.payload._id;
        setState(state, action);
      })
      .addCase(initListingCreator.rejected, (state, action) => {
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
      .addCase(submitListing.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(submitListing.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
        resetState(state);
      })
      .addCase(submitListing.rejected, (state, action) => {
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

export const selectListing = (state: RootState) => state.listingCreator;
export const selectListingSpecies = (state: RootState) =>
  state.listingCreator.biology?.species;
export const selectListingBreeds = (state: RootState) =>
  state.listingCreator.biology?.breeds;
export const selectListingOrigin = (state: RootState) =>
  state.listingCreator.biography?.origin;
export const selectListingGender = (state: RootState) =>
  state.listingCreator.biography?.gender;
export const selectListingBirthdate = (state: RootState) =>
  state.listingCreator.biography?.birthdate;
export const selectListingDescription = (state: RootState) =>
  state.listingCreator.biography?.description;
export const selectListingSize = (state: RootState) =>
  state.listingCreator.medical?.size;
export const selectListingWeight = (state: RootState) =>
  state.listingCreator.medical?.weight;
export const selectListingHairCoat = (state: RootState) =>
  state.listingCreator.medical?.hairCoat;
export const selectListingVaccines = (state: RootState) =>
  state.listingCreator.medical?.vaccines;
export const selectListingAvsLicenseNumber = (state: RootState) =>
  state.listingCreator.legal?.avsLicenseNumber;
export const selectListingLegalTags = (state: RootState) =>
  state.listingCreator.legal?.legalTags;
export const selectListingMedia = (state: RootState) =>
  state.listingCreator.media;
export const selectListingPrice = (state: RootState) =>
  state.listingCreator.price;
export const selectListingStatus = (state: RootState) =>
  state.listingCreator.status;
export const selectListingError = (state: RootState) =>
  state.listingCreator.error;

export default listingCreatorSlice.reducer;
