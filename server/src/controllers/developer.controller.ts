import { Response } from 'express';
import { IGetBreedsBySpeciesRequest, IGetVaccinesBySpeciesRequest } from '../models/listing/animal/animal.model';
import { IGetAllCountriesOfOriginRequest } from '../models/country.model';

const DogBreed = require('../models/listing/animal/dog/dogBreed.model');
const DogVaccine = require('../models/listing/animal/dog/dogVaccine.model');
const Country = require('../models/country.model');

export const getBreedsBySpecies = async (
  req: IGetBreedsBySpeciesRequest,
  res: Response
) => {
  const { species } = req.params;

  if (species === 'Dog') {
    return res.status(200).json({ breeds: await DogBreed.find() });
  } // else if...

  return res.status(400).json({ message: 'Invalid species.' });
};

export const getVaccinesBySpecies = async (
  req: IGetVaccinesBySpeciesRequest,
  res: Response
) => {
  const { species } = req.params;

  if (species === 'Dog') {
    return res.status(200).json({ vaccines: await DogVaccine.find() });
  } // else if...

  return res.status(400).json({ message: 'Invalid species.' });
};

export const getAllCountriesOfOrigin = async (
  req: IGetAllCountriesOfOriginRequest,
  res: Response
) => {
  return res.status(200).json({ countries: await Country.find() });
};
