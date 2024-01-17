import { NextFunction } from 'express';
import { KeyNotFoundError } from '../errors/key.error';
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
import { IListing } from '../interfaces/listing.interface';
import { IMedia } from '../interfaces/media.interface';
import ListingCreator from '../models/listing-creator.model';
import Listing from '../models/listing.model';
import { Logger } from '../services/logger';
import * as s3 from '../services/s3';

export const createListingCreator = async (
  req: ICreateListingCreatorRequest,
  res: ICreateListingCreatorResponse,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    Logger.update('Creating listing creator');

    const listingCreator = await ListingCreator.create(payload);

    Logger.success('Listing creator created', listingCreator._id.toString());

    const response = await listingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const createListing = async (
  req: ICreateListingRequest,
  res: ICreateListingResponse,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;

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

    Logger.success('Listing created', createdListing._id.toString());

    Logger.update('Deleting listing creator');

    await ListingCreator.findByIdAndDelete(_id);

    Logger.success('Listing creator deleted', _id);

    return res.status(200).json({});
  } catch (error: unknown) {
    next(error);
  }
};

export const getMyListingCreators = async (
  req: IGetMyListingCreatorsRequest,
  res: IGetMyListingCreatorsResponse,
  next: NextFunction
) => {
  try {
    const { userId } = req.query;

    Logger.update('Getting listing creators for user', userId);

    const listingCreators = await ListingCreator.find({ userId });

    Logger.success('Listing creators retrieved');

    const response = await Promise.all(
      listingCreators.map((listingCreator) => listingCreator.formatResponse())
    );

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const getListingCreatorById = async (
  req: IGetListingCreatorByIdRequest,
  res: ICreateListingCreatorResponse,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;

    Logger.update('Getting listing creator by id');

    const listingCreator = await ListingCreator.findById(_id);

    if (!listingCreator) {
      throw new KeyNotFoundError('Listing creator not found', '_id', _id);
    }

    Logger.success('Listing creator retrieved', _id);

    const response = await listingCreator.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateListingCreator = async (
  req: IUpdateListingCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    const updates = req.body;

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
  } catch (error: unknown) {
    next(error);
  }
};

export const updateBiologyCreator = async (
  req: IUpdateBiologyCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    const updates = req.body;

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
  } catch (error: unknown) {
    next(error);
  }
};

export const updateBiographyCreator = async (
  req: IUpdateBiographyCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    const updates = req.body;

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
  } catch (error: unknown) {
    next(error);
  }
};

export const updateMedicalCreator = async (
  req: IUpdateBiographyCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    const updates = req.body;

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
  } catch (error: unknown) {
    next(error);
  }
};

export const updateLegalCreator = async (
  req: IUpdateBiographyCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    const updates = req.body;

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
  } catch (error: unknown) {
    next(error);
  }
};

export const updateMediaCreator = async (
  req: IUpdateMediaCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    const { mediaNames } = req.body;
    const files = req.files as Express.Multer.File[];

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
  } catch (error: unknown) {
    next(error);
  }
};

export const updatePriceCreator = async (
  req: IUpdatePriceCreatorRequest,
  res: IUpdateListingCreatorResponse,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;
    const updates = req.body;

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
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteListingCreatorById = async (
  req: IDeleteListingCreatorRequest,
  res: IDeleteListingCreatorResponse,
  next: NextFunction
) => {
  try {
    const { _id } = req.params;

    Logger.update('Deleting listing creator by id');

    const deletedListingCreator = await ListingCreator.findByIdAndDelete(_id);

    if (!deletedListingCreator) {
      throw new KeyNotFoundError('Listing creator not found', '_id', _id);
    }

    Logger.success('Listing creator deleted', _id);

    return res.status(200).json({});
  } catch (error: unknown) {
    next(error);
  }
};
