import { NextFunction } from 'express';
import { IBreedModel } from '../models/breed.model';
import { Logger } from '../services/logger';
import {
  IGetBreedsRequest,
  IGetBreedsResponse
} from '../interfaces/breed.interface';

const Breed: IBreedModel = require('../models/breed.model');

export const getBreeds = async (
  req: IGetBreedsRequest,
  res: IGetBreedsResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching breeds');

    const breeds = await Breed.find(query);

    Logger.success('Breeds fetched');

    return res.status(200).json(breeds);
  } catch (error: any) {
    next(error);
  }
};
