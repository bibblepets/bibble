import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
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
  Vaccine
} from '../types';

interface ListingState {
  listing?: {
    saleType: SaleType;
  };
  biology?: {
    species?: Species;
    breed?: Breed;
  };
  biography?: {
    origin?: Country;
    gender?: Gender;
    birthdate?: string; // From a Date object
    description?: string;
  };
  medical?: {
    size?: Size;
    haircoat?: string;
    weight?: number;
    vaccinations?: Vaccine[];
  };
  legal?: {
    avsLicenseNumber?: string;
    licenses?: License[];
  };
  media?: Media[];
  price?: number;

  status: StatusType;
  error?: string;
}

const initialState: ListingState = {
  status: 'DEFAULT',
  error: undefined
};

const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    setSaleType: (state, action: PayloadAction<SaleType>) => {
      state.listing = {
        ...state.listing,
        saleType: action.payload
      };
    },
    setSpecies: (state, action: PayloadAction<Species>) => {
      state.biology = {
        ...state.biology,
        species: action.payload
      };
    },
    setBreed: (state, action: PayloadAction<Breed>) => {
      state.biology = {
        ...state.biology,
        breed: action.payload
      };
    },
    setOrigin: (state, action: PayloadAction<Country>) => {
      state.biography = {
        ...state.biography,
        origin: action.payload
      };
    },
    setGender: (state, action: PayloadAction<Gender>) => {
      state.biography = {
        ...state.biography,
        gender: action.payload
      };
    },
    setBirthdate: (state, action: PayloadAction<string>) => {
      state.biography = {
        ...state.biography,
        birthdate: action.payload
      };
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.biography = {
        ...state.biography,
        description: action.payload
      };
    },
    setSize: (state, action: PayloadAction<Size>) => {
      state.medical = {
        ...state.medical,
        size: action.payload
      };
    },
    setWeight: (state, action: PayloadAction<number>) => {
      state.medical = {
        ...state.medical,
        weight: action.payload
      };
    },
    setHairCoat: (state, action: PayloadAction<string>) => {
      state.medical = {
        ...state.medical,
        haircoat: action.payload
      };
    },
    addVaccination: (state, action: PayloadAction<Vaccine>) => {
      state.medical = {
        ...state.medical,
        vaccinations: [...(state.medical?.vaccinations || []), action.payload]
      };
    },
    removeVaccination: (state, action: PayloadAction<Vaccine>) => {
      state.medical = {
        ...state.medical,
        vaccinations: state.medical?.vaccinations?.filter(
          (v) => v.name !== action.payload.name
        )
      };
    },
    setAvsLicenseNumber: (state, action: PayloadAction<string>) => {
      state.legal = {
        ...state.legal,
        avsLicenseNumber: action.payload
      };
    },
    addLicense: (state, action: PayloadAction<License>) => {
      state.legal = {
        ...state.legal,
        licenses: [...(state.legal?.licenses || []), action.payload]
      };
    },
    removeLicense: (state, action: PayloadAction<License>) => {
      state.legal = {
        ...state.legal,
        licenses: state.legal?.licenses?.filter((l) => l !== action.payload)
      };
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
  }
});

export const {
  setSaleType,
  setSpecies,
  setBreed,
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
  state.listing.listing?.saleType;
export const selectListingSpecies = (state: RootState) =>
  state.listing.biology?.species;
export const selectListingBreed = (state: RootState) =>
  state.listing.biology?.breed;
export const selectListingOrigin = (state: RootState) =>
  state.listing.biography?.origin;
export const selectListingGender = (state: RootState) =>
  state.listing.biography?.gender;
export const selectListingBirthdate = (state: RootState) =>
  state.listing.biography?.birthdate;
export const selectListingDescription = (state: RootState) =>
  state.listing.biography?.description;
export const selectListingSize = (state: RootState) =>
  state.listing.medical?.size;
export const selectListingWeight = (state: RootState) =>
  state.listing.medical?.weight;
export const selectListingHairCoat = (state: RootState) =>
  state.listing.medical?.haircoat;
export const selectListingVaccinations = (state: RootState) =>
  state.listing.medical?.vaccinations;
export const selectListingAvsLicenseNumber = (state: RootState) =>
  state.listing.legal?.avsLicenseNumber;
export const selectListingLicenses = (state: RootState) =>
  state.listing.legal?.licenses;
export const selectListingMedia = (state: RootState) => state.listing.media;
export const selectListingPrice = (state: RootState) => state.listing.price;

export default listingSlice.reducer;
