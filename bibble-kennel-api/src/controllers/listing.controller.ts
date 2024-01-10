import { NextFunction } from 'express';
import {
  IGetListingsRequest,
  IGetListingsResponse,
  IGetMyListingsRequest,
  IGetMyListingsResponse
} from '../interfaces/listing.interface';
import { IListingModel } from '../models/listing.model';
import { Logger } from '../services/logger';

const Listing: IListingModel = require('../models/listing.model');

export const getListings = async (
  req: IGetListingsRequest,
  res: IGetListingsResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching listings');

    const listings = await Listing.find(query);

    Logger.success('Listings fetched');

    const response = await Promise.all(
      listings.map((listing) => listing.formatResponse())
    );

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const getMyListings = async (
  req: IGetMyListingsRequest,
  res: IGetMyListingsResponse,
  next: NextFunction
) => {
  const { userId } = req.body;

  try {
    Logger.update('Getting listings for user', userId);

    const listings = await Listing.find({ userId });

    Logger.update('Listings retrieved');

    const response = await Promise.all(
      listings.map((listing) => listing.formatResponse())
    );

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};
