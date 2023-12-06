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
};

export type LoginModalType = ModalType & {
  email: string;
  password: string;
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
};

export type Country = {
  _id?: string;
  name: string;
};

export type Gender = 'MALE' | 'FEMALE';

export type Vaccine = {
  _id?: string;
  name: string;
  isCore: boolean;
};

export type License = {
  _id?: string;
  name: string;
};

export type Media = {
  _id?: string;
  type: MediaType;
  url: string;
};

export type MediaType = 'Image' | 'V_id?eo';

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
