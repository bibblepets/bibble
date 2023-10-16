import { Request } from 'express';

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
