import { NextFunction } from 'express';
import {
  IGetSpeciesRequest,
  IGetSpeciesResponse
} from '../interfaces/species.interface';
import Species from '../models/species.model';
import { Logger } from '../services/logger';

export const getSpecies = async (
  req: IGetSpeciesRequest,
  res: IGetSpeciesResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching species');

    const species = await Species.find(query);

    Logger.success('Species fetched');

    return res.status(200).json(species);
  } catch (error: unknown) {
    next(error);
  }
};
