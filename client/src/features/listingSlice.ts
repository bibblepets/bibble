import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, store } from '../store';
import {
  Breed,
  Country,
  Gender,
  License,
  Media,
  SaleType,
  Size,
  Species,
  StatusType,
  User,
  Vaccine
} from '../types';
import axios from 'axios';

interface ListingState {
  saleType?: SaleType;
  species: Species;
  breeds?: Breed[];
  origin?: Country;
  gender?: Gender;
  birthdate: Date;
  description?: string;
  size?: Size;
  hairCoat?: string;
  weight?: number;
  vaccinations?: Vaccine[];
  avsLicenseNumber?: string;
  licenses?: License[];
  media?: Media[];
  price?: number;

  status: StatusType;
  error?: string;
}

const initialState: ListingState = {
  species: 'Dog',
  birthdate: new Date(Date.now()),
  status: 'DEFAULT',
  error: undefined
};

export const createListing = createAsyncThunk(
  '/listingSlice/createListing',
  async (payload: { currentUser: User; listing: ListingState }) => {
    const { currentUser, listing } = payload;
    const licenses = listing.licenses?.reduce((acc, license) => {
      return { ...acc, [license]: true };
    }, {});
    const listingPayload = {
      lister: currentUser,
      price: listing.price,
      description: listing.description,
      saleType: listing.saleType,
      media: listing.media,
      animal: {
        breeds: listing.breeds,
        vaccines: listing.vaccinations,
        origin: listing.origin,
        name: undefined, // TODO: Add name field to listing
        gender: listing.gender,
        birthdate: listing.birthdate,
        size: listing.size,
        weight: listing.weight,
        hairCoat: listing.hairCoat,
        ...licenses,
        avsLicenseNumber: listing.avsLicenseNumber
      },
      species: listing.species
    };

    return await axios
      .post('/api/pet-listings', listingPayload)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        throw new Error(error.response.data.message);
      });
  }
);

const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    setSaleType: (state, action: PayloadAction<SaleType>) => {
      state.saleType = action.payload;
    },
    setSpecies: (state, action: PayloadAction<Species>) => {
      state.species = action.payload;
    },
    addBreed: (state, action: PayloadAction<Breed>) => {
      state.breeds = [...(state.breeds || []), action.payload];
    },
    removeBreed: (state, action: PayloadAction<Breed>) => {
      state.breeds = state.breeds?.filter((b) => b !== action.payload);
    },
    setOrigin: (state, action: PayloadAction<Country>) => {
      state.origin = action.payload;
    },
    setGender: (state, action: PayloadAction<Gender>) => {
      state.gender = action.payload;
    },
    setBirthdate: (state, action: PayloadAction<Date>) => {
      state.birthdate = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setSize: (state, action: PayloadAction<Size>) => {
      state.size = action.payload;
    },
    setWeight: (state, action: PayloadAction<number>) => {
      state.weight = action.payload;
    },
    setHairCoat: (state, action: PayloadAction<string>) => {
      state.hairCoat = action.payload;
    },
    addVaccination: (state, action: PayloadAction<Vaccine>) => {
      state.vaccinations = [...(state.vaccinations || []), action.payload];
    },
    removeVaccination: (state, action: PayloadAction<Vaccine>) => {
      state.vaccinations = state.vaccinations?.filter(
        (v) => v !== action.payload
      );
    },
    setAvsLicenseNumber: (state, action: PayloadAction<string>) => {
      state.avsLicenseNumber = action.payload;
    },
    addLicense: (state, action: PayloadAction<License>) => {
      state.licenses = [...(state.licenses || []), action.payload];
    },
    removeLicense: (state, action: PayloadAction<License>) => {
      state.licenses = state.licenses?.filter((l) => l !== action.payload);
    },
    addMedia: (state, action: PayloadAction<Media>) => {
      state.media = [...(state.media || []), action.payload];
    },
    removeMedia: (state, action: PayloadAction<Media>) => {
      state.media = state.media?.filter((m) => m.url !== action.payload.url);
    },
    setPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
    },
    reset: (state) => {
      state = initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createListing.pending, (state) => {
        state.status = 'LOADING';
        state.error = undefined;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.status = 'SUCCESS';
      })
      .addCase(createListing.rejected, (state, action) => {
        state.status = 'ERROR';
        state.error = action.error.message;
      });
  }
});

export const {
  setSaleType,
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
  addLicense,
  removeLicense,
  addMedia,
  removeMedia,
  setPrice,
  reset
} = listingSlice.actions;

export const selectListing = (state: RootState) => state.listing;
export const selectListingStatus = (state: RootState) => state.listing.status;
export const selectListingError = (state: RootState) => state.listing.error;
export const selectListingSaleType = (state: RootState) =>
  state.listing.saleType;
export const selectListingSpecies = (state: RootState) => state.listing.species;
export const selectListingBreeds = (state: RootState) => state.listing.breeds;
export const selectListingOrigin = (state: RootState) => state.listing.origin;
export const selectListingGender = (state: RootState) => state.listing.gender;
export const selectListingBirthdate = (state: RootState) =>
  state.listing.birthdate;
export const selectListingDescription = (state: RootState) =>
  state.listing.description;
export const selectListingSize = (state: RootState) => state.listing.size;
export const selectListingWeight = (state: RootState) => state.listing.weight;
export const selectListingHairCoat = (state: RootState) =>
  state.listing.hairCoat;
export const selectListingVaccinations = (state: RootState) =>
  state.listing.vaccinations;
export const selectListingAvsLicenseNumber = (state: RootState) =>
  state.listing.avsLicenseNumber;
export const selectListingLicenses = (state: RootState) =>
  state.listing.licenses;
export const selectListingMedia = (state: RootState) => state.listing.media;
export const selectListingPrice = (state: RootState) => state.listing.price;

export default listingSlice.reducer;
