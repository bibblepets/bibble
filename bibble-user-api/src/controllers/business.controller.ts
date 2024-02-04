import { NextFunction } from 'express';
import { KeyNotFoundError } from '../errors/key.error';
import {
  IGetBusinessRequest,
  IGetBusinessResponse,
  IUpdateBusinessMediaRequest,
  IUpdateBusinessMediaResponse,
  IUpdateBusinessRequest,
  IUpdateBusinessResponse
} from '../interfaces/business.interface';
import { IMedia } from '../interfaces/media.interface';
import Business from '../models/business.model';
import { Logger } from '../services/logger';
import * as s3 from '../services/s3';
import { validateObjectId } from '../validators/objectId';

export const getBusiness = async (
  req: IGetBusinessRequest,
  res: IGetBusinessResponse,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;
    let business;

    Logger.update('Getting business');

    if (businessId) {
      validateObjectId(businessId);

      business = await Business.findById(businessId);

      if (!business) {
        throw new KeyNotFoundError('Business not found', 'id', businessId);
      }
    }

    if (!business) {
      throw new KeyNotFoundError('Business not found', 'id', businessId);
    }

    Logger.success('Business found', business?._id.toString());

    const response = await business?.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateBusiness = async (
  req: IUpdateBusinessRequest,
  res: IUpdateBusinessResponse,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;
    const updates = req.body;

    Logger.update('Updating business');

    validateObjectId(businessId);

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBusiness) {
      throw new KeyNotFoundError('Business not found', 'id', businessId);
    }

    Logger.success('Business updated', updatedBusiness?._id.toString());

    const response = await updatedBusiness?.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateBusinessMedia = async (
  req: IUpdateBusinessMediaRequest,
  res: IUpdateBusinessMediaResponse,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;
    const { media } = req.body;
    const files = req.files as Express.Multer.File[];

    Logger.update('Updating business media');

    let mediaUpdates: IMedia[] | undefined;

    if (Array.isArray(media) && media.length) {
      mediaUpdates = media.map((name) => ({ name }));
    }

    const updates = {
      media: await s3.putMedia(
        businessId,
        files,
        mediaUpdates,
        s3.BUSINESS_BUCKET_NAME
      )
    };

    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBusiness) {
      throw new KeyNotFoundError('Business not found', 'id', businessId);
    }

    Logger.success('Business media updated', businessId);

    const response = await updatedBusiness?.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};
