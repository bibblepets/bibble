import { NextFunction } from 'express';
import {
  IGetCountriesRequest,
  IGetCountriesResponse
} from '../interfaces/country.interface';
import { ICountryModel } from '../models/country.model';
import { Logger } from '../services/logger';

const Country: ICountryModel = require('../models/country.model');

export const getCountries = async (
  req: IGetCountriesRequest,
  res: IGetCountriesResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching countries');

    const countries = await Country.find(query);

    Logger.update('Countries fetched');

    return res.status(200).json(countries);
  } catch (error) {
    next(error);
  }
};
