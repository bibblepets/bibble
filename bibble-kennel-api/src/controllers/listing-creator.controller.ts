import { NextFunction } from 'express';
import {
  ICreateListingCreatorRequest,
  ICreateListingCreatorResponse,
  ICreateListingRequest,
  ICreateListingResponse,
  IDeleteListingCreatorRequest,
  IDeleteListingCreatorResponse,
  IGetListingCreatorByIdRequest,
  IGetMyListingCreatorsRequest,
  IGetMyListingCreatorsResponse,
  IUpdateBiographyCreatorRequest,
  IUpdateBiologyCreatorRequest,
  IUpdateListingCreatorRequest,
  IUpdateListingCreatorResponse,
  IUpdateMediaCreatorRequest,
  IUpdatePriceCreatorRequest
} from '../interfaces/listing-creator.interface';
import { IListingCreatorModel } from '../models/listing-creator.model';
import { Logger } from '../services/logger';
import { KeyNotFoundError } from '../errors/key.error';
import { IMedia } from '../interfaces/media.interface';
import { IListingModel } from '../models/listing.model';
import { IListing } from '../interfaces/listing.interface';
import * as s3 from '../services/s3';

const Listing: IListingModel = require('../models/listing.model');

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

export const createListing = async (
  req: ICreateListingRequest,
  res: ICreateListingResponse,
  next: NextFunction
) => {
  const { _id } = req.params;

  try {
    Logger.update('Creating listing');

    const listingCreator = await ListingCreator.findById(_id);

    if (!listingCreator) {
      throw new KeyNotFoundError('Listing creator not found', '_id', _id);
    }

    const listing: IListing = {
      _id: listingCreator._id,
      userId: listingCreator.userId,
      speciesId: listingCreator.biology!.speciesId!,
      breedIds: listingCreator.biology!.breedIds!,
      originId: listingCreator.biography!.originId!,
      hairCoatId: listingCreator.medical!.hairCoatId!,
      vaccineIds: listingCreator.medical!.vaccineIds!,
      legalTagIds: listingCreator.legal!.legalTagIds!,
      saleType: listingCreator.saleType,
      name: listingCreator.biography!.name,
      gender: listingCreator.biography!.gender!,
      birthdate: listingCreator.biography!.birthdate!,
      description: listingCreator.biography!.description!,
      size: listingCreator.medical!.size!,
      weight: listingCreator.medical!.weight!,
      avsLicenseNumber: listingCreator.legal!.avsLicenseNumber!,
      price: listingCreator.price!,
      media: listingCreator.media!
    };

    const createdListing = await Listing.create(listing);

    Logger.success('Listing created', createdListing._id);

    Logger.update('Deleting listing creator');

    await ListingCreator.findByIdAndDelete(_id);

    Logger.success('Listing creator deleted', _id);

    return res.status(200).json({});
  } catch (error: any) {
    next(error);
  }
};

export const getMyListingCreators = async (
  req: IGetMyListingCreatorsRequest,
  res: IGetMyListingCreatorsResponse,
  next: NextFunction
) => {
  const { userId } = req.query;

  try {
    Logger.update('Getting listing creators for user', userId);

    const listingCreators = await ListingCreator.find({ userId });

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
  const { _id } = req.params;

  try {
    Logger.update('Getting listing creator by id');

    const listingCreator = await ListingCreator.findById(_id);

    if (!listingCreator) {
      throw new KeyNotFoundError('Listing creator not found', '_id', _id);
    }

    Logger.success('Listing creator retrieved', _id);

    const response = await listingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const updateListingCreator = async (
  req: IUpdateListingCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating listing creator');

    const updatedListingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedListingCreator) {
      throw new KeyNotFoundError('Listing creator not found', '_id', _id);
    }

    Logger.success('Listing creator updated', _id);

    const response = await updatedListingCreator.formatResponse();

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
  const { _id } = req.params;
  const updates = req.body;
  console.log(updates);

  try {
    Logger.update('Updating biology creator');

    const updatedListingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage: 1,
        ...updates
      },
      {
        new: true,
        runValidators: true
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
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating biography creator');

    const updatedListingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage: 2,
        ...updates
      },
      {
        new: true,
        runValidators: true
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
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating medical creator');

    const updatedListingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage: 3,
        ...updates
      },
      {
        new: true,
        runValidators: true
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
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating legal creator');

    const updatedListingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage: 4,
        ...updates
      },
      {
        new: true,
        runValidators: true
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
  const { _id } = req.params;
  const { mediaNames } = req.body;
  const files = req.files as Express.Multer.File[];

  try {
    Logger.update('Updating media creator');

    let media: IMedia[] | undefined;

    if (Array.isArray(mediaNames) && mediaNames.length) {
      media = mediaNames.map((name) => ({ name }));
    }

    const updates = {
      media: await s3.putMedia(_id, files, media, s3.listingBucketName)
    };

    const updatedListingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage: 5,
        ...updates
      },
      {
        new: true,
        runValidators: true
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
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating price creator');

    const updatedListingCreator = await ListingCreator.findByIdAndUpdate(
      _id,
      {
        stage: 6,
        ...updates
      },
      {
        new: true,
        runValidators: true
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

export const deleteListingCreatorById = async (
  req: IDeleteListingCreatorRequest,
  res: IDeleteListingCreatorResponse,
  next: NextFunction
) => {
  const { _id } = req.params;

  try {
    Logger.update('Deleting listing creator by id');

    const deletedListingCreator = await ListingCreator.findByIdAndDelete(_id);

    if (!deletedListingCreator) {
      throw new KeyNotFoundError('Listing creator not found', '_id', _id);
    }

    Logger.success('Listing creator deleted', _id);

    return res.status(200).json({});
  } catch (error: any) {
    next(error);
  }
};
