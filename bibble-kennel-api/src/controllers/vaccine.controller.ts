import { NextFunction } from 'express';
import {
  IGetVaccinesRequest,
  IGetVaccinesResponse
} from '../interfaces/vaccine.interface';
import Vaccine from '../models/vaccine.model';
import { Logger } from '../services/logger';

export const getVaccines = async (
  req: IGetVaccinesRequest,
  res: IGetVaccinesResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching vaccines');

    const vaccines = await Vaccine.find(query);

    Logger.update('Vaccines fetched');

    return res.status(200).json(vaccines);
  } catch (error) {
    next(error);
  }
};
