import { NextFunction } from 'express';
import {
  IGetHairCoatsRequest,
  IGetHairCoatsResponse
} from '../interfaces/hair-coat.interface';
import HairCoat from '../models/hair-coat.model';
import { Logger } from '../services/logger';

export const getHairCoats = async (
  req: IGetHairCoatsRequest,
  res: IGetHairCoatsResponse,
  next: NextFunction
) => {
  try {
    const query = req.query;

    Logger.update('Fetching hair coats');

    const hairCoats = await HairCoat.find(query);

    Logger.success('Hair coats fetched');

    return res.status(200).json(hairCoats);
  } catch (error) {
    next(error);
  }
};
