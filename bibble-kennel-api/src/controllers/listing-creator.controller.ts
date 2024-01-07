import { NextFunction } from 'express';
import {
  ICreateListingCreatorRequest,
  ICreateListingCreatorResponse
} from '../interfaces/listing-creator.interface';
import { IListingCreatorModel } from '../models/listing-creator.model';
import { Logger } from '../services/logger';

const ListingCreator: IListingCreatorModel = require('../models/listing-creator.model');

export const createListingCreator = async (
  req: ICreateListingCreatorRequest,
  res: ICreateListingCreatorResponse,
  next: NextFunction
) => {
  const payload = req.body;

  try {
    Logger.update('Creating listing creator');

    const listingCreator = await ListingCreator.create(payload);

    Logger.success('Listing creator created', listingCreator._id);

    const response = await listingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};
