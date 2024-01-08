import { NextFunction } from 'express';
import {
  ICreateListingCreatorRequest,
  ICreateListingCreatorResponse,
  IGetListingCreatorByIdRequest,
  IUpdateBiologyCreatorRequest,
  IUpdateListingCreatorResponse
} from '../interfaces/listing-creator.interface';
import { IListingCreatorModel } from '../models/listing-creator.model';
import { Logger } from '../services/logger';
import { KeyNotFoundError } from '../errors/key.error';

const ListingCreator: IListingCreatorModel = require('../models/listing-creator.model');

export const getListingCreatorById = async (
  req: IGetListingCreatorByIdRequest,
  res: ICreateListingCreatorResponse,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    Logger.update('Getting listing creator by id');

    const listingCreator = await ListingCreator.findById(id);

    if (!listingCreator) {
      throw new KeyNotFoundError('Listing creator not found', 'id', id);
    }

    Logger.success('Listing creator retrieved', listingCreator._id);

    const response = await listingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

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

export const updateBiologyCreator = async (
  req: IUpdateBiologyCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id, ...updates } = req.body;

  try {
    Logger.update('Updating biology creator');

    const updatedListingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      updates,
      {
        new: true
      }
    );

    if (!updatedListingCreator) {
      throw new KeyNotFoundError('Listing creator not found', '_id', _id);
    }

    Logger.success('Biology creator updated', _id);

    const response = await updatedListingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};
