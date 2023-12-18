import { Response } from 'express';
import {
  IGetBreedsBySpeciesRequest,
  IGetHairCoatsBySpeciesRequest,
  IGetLegalTagsBySpeciesRequest,
  IGetVaccinesBySpeciesRequest
} from '../models/listing/animal/animal.model';
import { IGetAllCountriesOfOriginRequest } from '../models/country.model';

const {
  hairCoats : dogHairCoats,
  legalTags: dogLegalTags
}: {
  hairCoats: string[];
  legalTags: string[];
} = require('../models/listing/animal/dog/dog.model');
const Breed = require('../models/listing/animal/breed.model');
const Vaccine = require('../models/listing/animal/vaccine.model');
const Country = require('../models/country.model');

export const getBreedsBySpecies = async (
  req: IGetBreedsBySpeciesRequest,
  res: Response
) => {
  const { species } = req.params;

  if (species === 'Dog') {
    return res.status(200).json(await Breed.find({ species: 'Dog' }));
  } // else if...

  return res.status(400).json({ message: 'Invalid species.' });
};

export const getVaccinesBySpecies = async (
  req: IGetVaccinesBySpeciesRequest,
  res: Response
) => {
  const { species } = req.params;

  if (species === 'Dog') {
    return res.status(200).json(await Vaccine.find({ species: 'Dog' }));
  } // else if...

  return res.status(400).json({ message: 'Invalid species.' });
};

export const getAllCountriesOfOrigin = async (
  req: IGetAllCountriesOfOriginRequest,
  res: Response
) => {
  return res.status(200).json(await Country.find());
};

export const getHairCoatsBySpecies = async (
  req: IGetHairCoatsBySpeciesRequest,
  res: Response
) => {
  const { species } = req.params;

  if (species === 'Dog') {
    return res.status(200).json(dogHairCoats);
  } // else if...

  return res.status(400).json({ message: 'Invalid species.' });
};

export const getLegalTagsBySpecies = async (
  req: IGetLegalTagsBySpeciesRequest,
  res: Response
) => {
  const { species } = req.params;

  if (species === 'Dog') {
    return res.status(200).json(dogLegalTags);
  } // else if...

  return res.status(400).json({ message: 'Invalid species.' });
}
