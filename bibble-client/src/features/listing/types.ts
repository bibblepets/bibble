import { Gender, Media } from '../types';

export type ListingCreatorStage =
  | 'Biology'
  | 'Biography'
  | 'Medical'
  | 'Legal'
  | 'Media'
  | 'Price'
  | 'Summary';

export type ListingCreator = {
  _id?: string;
  stage: number;
  saleType?: SaleType;
  biology?: Partial<BiologyCreator>;
  biography?: Partial<BiographyCreator>;
  medical?: Partial<MedicalCreator>;
  legal?: Partial<LegalCreator>;
  media?: Media[];
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SaleType = 'adoption' | 'sale';

export type Size = 'small' | 'medium' | 'large';

export type BiologyCreator = {
  speciesId: string;
  breedIds: string[];

  species?: Species;
  breeds?: Breed[];
};

export type BiographyCreator = {
  originId: string;
  name: string;
  gender: Gender;
  birthdate: Date | string;
  description: string;

  origin?: Country;
};

export type MedicalCreator = {
  hairCoatId: string;
  vaccineIds: string[];
  size: string;
  weight: number;

  hairCoat?: HairCoat;
  vaccines?: Vaccine[];
};

export type LegalCreator = {
  avsLicenseNumber: string;
  legalTagIds: string[];

  legalTags?: LegalTag[];
};

export type Country = {
  _id?: string;
  name: string;
};

export type Species = {
  _id?: string;
  name: string;
};

export type Breed = {
  _id?: string;
  speciesId: string;
  name: string;
};

export type Vaccine = {
  _id?: string;
  name: string;
  species: string;
  isCore: boolean;
};

export type LegalTag = {
  _id?: string;
  speciesId: string;
  name: string;
};

export type HairCoat = {
  _id?: string;
  speciesId: string;
  name: string;
};
