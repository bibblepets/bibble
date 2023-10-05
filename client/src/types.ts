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
};

export type BuyerProfile = {
  firstName: string;
  lastName: string;
  favouriteListings?: string[];
  profilePic?: string;
  contactNumber?: string;
  bio?: string;
};

export type Listing = {
  lister: User;
  saleType: SaleType;
  species: Species;
  breed: Breed;
  origin: Country;
  gender: Gender;
  birthdate: Date;
  description: string;
  weight: number;
  vaccinations: Vaccine[];
  licenses: License[];
  media: Media[];
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SaleType = 'SALE' | 'ADOPTION';

export type Species = {
  name: string;
};

export type Breed = {
  name: string;
};

export type Country = {
  name: string;
};

export type Gender = 'MALE' | 'FEMALE';

export type Vaccine = {
  name: string;
};

export type License = {
  name: string;
};

export type Media = {
  url: string;
};

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
