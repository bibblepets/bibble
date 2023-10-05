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
  email: string;
  password?: string;
  buyerProfile?: BuyerProfile;
  businessProfile?: BusinessProfile;
};

export type BuyerProfile = {
  firstName: string;
  lastName: string;
  favouriteListings?: string[];
  profilePic?: string;
  contactNumber?: string;
  bio?: string;
};

export type BusinessProfile = {
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
  name: string;
};

export type Country = {
  name: string;
};

export type Gender = 'MALE' | 'FEMALE';

export type Vaccine = {
  name: string;
  isCore: boolean;
};

export type License = {
  name: string;
};

export type Media = {
  type: MediaType;
  url: string;
};

export type MediaType = 'Image' | 'Video';

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
      place_id: string;
      plus_code: {
        compound_code: string;
        global_code: string;
      };
      types: [string];
    }
  ];
  status: string;
};
