import { NextFunction } from 'express';
import { KeyNotFoundError } from '../errors/key.error';
import {
  IGetListingByIdRequest,
  IGetListingByIdResponse,
  IGetListingsRequest,
  IGetListingsResponse,
  IGetMyListingsRequest,
  IGetMyListingsResponse,
  IUpdateListingMediaRequest,
  IUpdateListingMediaResponse,
  IUpdateListingRequest,
  IUpdateListingResponse
} from '../interfaces/listing.interface';
import { IMedia } from '../interfaces/media.interface';
import Listing from '../models/listing.model';
import { Logger } from '../services/logger';
import * as s3 from '../services/s3';

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
  } catch (error: unknown) {
    next(error);
  }
};

export const getMyListings = async (
  req: IGetMyListingsRequest,
  res: IGetMyListingsResponse,
  next: NextFunction
) => {
  const { userId } = req.query;

  try {
    Logger.update('Getting listings for user', userId);

    const listings = await Listing.find({ userId });

    Logger.update('Listings retrieved');

    const response = await Promise.all(
      listings.map((listing) => listing.formatResponse())
    );

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const getListingById = async (
  req: IGetListingByIdRequest,
  res: IGetListingByIdResponse,
  next: NextFunction
) => {
  const { _id } = req.params;

  try {
    Logger.update('Getting listing', _id);

    const listing = await Listing.findById(_id);

    if (!listing) {
      throw new KeyNotFoundError('Listing not found', 'id', _id);
    }

    Logger.update('Listing retrieved', _id);

    const response = await listing.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateListing = async (
  req: IUpdateListingRequest,
  res: IUpdateListingResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    Logger.update('Updating listing', _id);

    const updatedListing = await Listing.findByIdAndUpdate(_id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedListing) {
      throw new KeyNotFoundError('Listing not found', 'id', _id.toString());
    }

    Logger.success('Listing updated', _id);

    const response = await updatedListing.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateListingMedia = async (
  req: IUpdateListingMediaRequest,
  res: IUpdateListingMediaResponse,
  next: NextFunction
) => {
  const { _id } = req.params;
  const { mediaNames } = req.body;
  const files = req.files as Express.Multer.File[];

  try {
    Logger.update('Updating listing media', _id);

    let media: IMedia[] | undefined;

    if (Array.isArray(mediaNames) && mediaNames.length) {
      media = mediaNames.map((name) => ({ name }));
    }

    const updates = {
      media: await s3.putMedia(_id, files, media, s3.listingBucketName)
    };

    const updatedListing = await Listing.findByIdAndUpdate(_id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedListing) {
      throw new KeyNotFoundError('Listing not found', 'id', _id.toString());
    }

    Logger.success('Listing media updated', _id);

    const response = await updatedListing.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};
