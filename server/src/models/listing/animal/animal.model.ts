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