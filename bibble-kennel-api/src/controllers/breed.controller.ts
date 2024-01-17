import { NextFunction } from 'express';
import {
  IGetBreedsRequest,
  IGetBreedsResponse
} from '../interfaces/breed.interface';
import Breed from '../models/breed.model';
import { Logger } from '../services/logger';

export const getBreeds = async (
  req: IGetBreedsRequest,
  res: IGetBreedsResponse,
  next: NextFunction
) => {
  try {
    const query = req.query;

    Logger.update('Fetching breeds');

    const breeds = await Breed.find(query);

    Logger.success('Breeds fetched');

    return res.status(200).json(breeds);
  } catch (error: unknown) {
    next(error);
  }
};
