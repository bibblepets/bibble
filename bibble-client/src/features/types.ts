import { NavigateFunction } from 'react-router-dom';

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

export type ConfirmDeleteModalType = ModalType & {
  navigate?: NavigateFunction;
};

export type ViewMoreModalType = ModalType & {
  content: string;
};

export type Gender = 'male' | 'female';

export type Address = {
  country: string;
  streetAddress: string;
  unit: string;
  city: string;
  postcode: string;
};

export type Media = {
  _id?: string;
  name: string;
  url?: string;
  file?: File;
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
