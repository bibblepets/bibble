import { Request } from 'express';
import { Schema } from 'mongoose';
import { ICountry } from '../../country.model';
import { IVaccine } from './vaccine.model';
import { IBreed } from './breed.model';

export const sizes = ['Small', 'Medium', 'Large'];
export const genders = ['Male', 'Female'];

export interface IAnimal {
  _id: Schema.Types.ObjectId;
  breeds: IBreed['_id'][];
  vaccines?: IVaccine['_id'][];
  origin: ICountry['_id'];
  name?: string;
  gender: string;
  birthdate: Date;
  size: string;
  weight: number;
  avsLicenseNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopulatedAnimal {
  _id: Schema.Types.ObjectId;
  breeds: IBreed[];
  vaccines?: IVaccine[];
  origin: ICountry;
  name?: string;
  gender: string;
  birthdate: Date;
  size: string;
  weight: number;
  avsLicenseNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetBreedsBySpeciesRequest extends Request {
  params: {
    species: string;
  };
}

export interface IGetVaccinesBySpeciesRequest extends Request {
  params: {
    species: string;
  };
}

export interface IGetHairCoatsBySpeciesRequest extends Request {
  params: {
    species: string;
  };
}

export interface IGetLegalTagsBySpeciesRequest extends Request {
  params: {
    species: string;
  };
}

export interface ICreateAnimalRequest extends Request {
  body: Omit<
    IAnimal,
    '_id' | 'createdAt' | 'updatedAt' | 'breeds' | 'vaccines' | 'origin'
  > & {
    breeds: IBreed['_id'][];
    vaccines: IVaccine['_id'][];
    origin: ICountry['_id'];
  };
}

export interface IUpdateAnimalRequest extends Request {
  body: Partial<ICreateAnimalRequest['body']>;
}


export function validateAVSLicenseNumber(avsLicenseNumber: string): boolean {
  // TODO: Implement AVS license number validation
  return true;
}
