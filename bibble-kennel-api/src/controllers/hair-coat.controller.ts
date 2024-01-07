import { NextFunction } from 'express';
import {
  IGetHairCoatsRequest,
  IGetHairCoatsResponse
} from '../interfaces/hair-coat.interface';
import { IHairCoatModel } from '../models/hair-coat.model';
import { Logger } from '../services/logger';

const HairCoat: IHairCoatModel = require('../models/hair-coat.model');

export const getHairCoats = async (
  req: IGetHairCoatsRequest,
  res: IGetHairCoatsResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching hair coats');

    const hairCoats = await HairCoat.find(query);

    Logger.success('Hair coats fetched');

    return res.status(200).json(hairCoats);
  } catch (error) {
    next(error);
  }
};
