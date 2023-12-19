// REDUX TYPES
// ------------------------------
export type StatusType = 'DEFAULT' | 'LOADING' | 'SUCCESS' | 'ERROR';

export type ModalType = {
  isOpen: boolean;
  status: StatusType;
};

export type RegisterModalType = ModalType & {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  title: string;
};

export type LoginModalType = ModalType & {
  email: string;
  password: string;
  title: string;
};

// MODEL TYPES
// ------------------------------

export type User = {
  _id?: string;
  email: string;
  password?: string;
  buyerProfile?: BuyerProfile;
  businessProfile?: BusinessProfile;
  createdAt?: Date;
  updatedAt?: Date;
};

export type BuyerProfile = {
  _id?: string;
  firstName: string;
  lastName: string;
  favouriteListings?: string[];
  profilePic?: string;
  contactNumber?: string;
  bio?: string;
};

export type BusinessProfile = {
  _id?: string;
  bibbleTier: string;
  businessName: string;
  businessPic?: string;
  businessBio?: string;
  businessAddress: string;
  businessContact: string;
  businessEmail: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ListingCreator = {
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
};

export type Listing = {
  _id?: string;
  lister: User;
  price: number;
  description: string;
  saleType: SaleType;
  media: Media[];
  animal: Animal;
  species: Species;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Animal = {
  _id?: string;
  breeds: Breed[];
  vaccines: Vaccine[];
  origin: Country;
  name?: string;
  gender: string;
  birthdate: Date;
  size: string;
  weight: number;
  hairCoat: string;
  isHypoallergenic: boolean;
  isMicrochipped: boolean;
  isNeutered: boolean;
  isHdbApproved: boolean;
  avsLicenseNumber: string;
};

export type SaleType = 'Sale' | 'Adoption';

export type Species = string;

export type Breed = {
  _id?: string;
  name: string;
  species: Species;
};

export type Country = {
  _id?: string;
  name: string;
};

export type Gender = 'Male' | 'Female';

export type Size = 'Small' | 'Medium' | 'Large';

export type HairCoat = string;

export type Vaccine = {
  _id?: string;
  name: string;
  species: Species;
  isCore: boolean;
};

export type LegalTag = string;

export type Media = {
  _id?: string;
  file: File;
  url: string;
};

export type MediaType = 'image/png' | 'image/jpeg' | 'image/jpg';

export type ListingStage =
  | ''
  | 'Biology'
  | 'Biography'
  | 'Medical'
  | 'Legal'
  | 'Media'
  | 'Price'
  | 'Summary';

export type GeocodeResponse = {
  results: [
    {
      address_components: [
        {
          long_name: string;
          short_name: string;
          types: [string];
        },
        {
          long_name: string;
          short_name: string;
          types: [string];
        },
        {
          long_name: string;
          short_name: string;
          types: [string, string];
        },
        {
          long_name: string;
          short_name: string;
          types: [string, string];
        },
        {
          long_name: string;
          short_name: string;
          types: [string, string];
        },
        {
          long_name: string;
          short_name: string;
          types: [string, string];
        },
        {
          long_name: number;
          short_name: number;
          types: [string];
        }
      ];
      formatted_address: string;
      geometry: {
        location: {
          lat: number;
          lng: number;
        };
        location_type: string;
        viewport: {
          northeast: {
            lat: number;
            lng: number;
          };
          southwest: {
            lat: number;
            lng: number;
          };
        };
      };
      place__id?: string;
      plus_code: {
        compound_code: string;
        global_code: string;
      };
      types: [string];
    }
  ];
  status: string;
};
