import { NextFunction } from 'express';
import {
  ICreateListingCreatorRequest,
  ICreateListingCreatorResponse,
  IGetListingCreatorByIdRequest,
  IGetListingCreatorsRequest,
  IGetListingCreatorsResponse,
  IUpdateBiographyCreatorRequest,
  IUpdateBiologyCreatorRequest,
  IUpdateListingCreatorResponse,
  IUpdateMediaCreatorRequest,
  IUpdatePriceCreatorRequest
} from '../interfaces/listing-creator.interface';
import { IListingCreatorModel } from '../models/listing-creator.model';
import { Logger } from '../services/logger';
import { KeyNotFoundError } from '../errors/key.error';
import { IMedia } from '../interfaces/media.interface';
import * as s3 from '../services/s3';

const ListingCreator: IListingCreatorModel = require('../models/listing-creator.model');

export const getListingCreators = async (
  req: IGetListingCreatorsRequest,
  res: IGetListingCreatorsResponse,
  next: NextFunction
) => {
  try {
    Logger.update('Getting listing creators');

    const listingCreators = await ListingCreator.find();

    Logger.success('Listing creators retrieved');

    const response = await Promise.all(
      listingCreators.map((listingCreator) => listingCreator.formatResponse())
    );

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

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

export const updateBiographyCreator = async (
  req: IUpdateBiographyCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id, ...updates } = req.body;

  try {
    Logger.update('Updating biography creator');

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

    Logger.success('Biography creator updated', _id);

    const response = await updatedListingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const updateMedicalCreator = async (
  req: IUpdateBiographyCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id, ...updates } = req.body;

  try {
    Logger.update('Updating medical creator');

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

    Logger.success('Medical creator updated', _id);

    const response = await updatedListingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const updateLegalCreator = async (
  req: IUpdateBiographyCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id, ...updates } = req.body;

  try {
    Logger.update('Updating legal creator');

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

    Logger.success('Legal creator updated', _id);

    const response = await updatedListingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const updateMediaCreator = async (
  req: IUpdateMediaCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id, stage, mediaNames } = req.body;
  const files = req.files as Express.Multer.File[];

  try {
    Logger.update('Updating media creator');

    let media: IMedia[] | undefined;

    if (Array.isArray(mediaNames) && mediaNames.length) {
      media = mediaNames.map((name) => ({ name }));
    }

    const updates = {
      stage,
      media: await s3.putMedia(_id, files, media, s3.listingBucketName)
    };

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

    Logger.success('Media creator updated', _id);

    const response = await updatedListingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const updatePriceCreator = async (
  req: IUpdatePriceCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id, ...updates } = req.body;

  try {
    Logger.update('Updating price creator');

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

    Logger.success('Price creator updated', _id);

    const response = await updatedListingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};
