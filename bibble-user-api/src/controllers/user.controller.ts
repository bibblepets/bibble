import { NextFunction } from 'express';
import {
  IGetUserRequest,
  IGetUserResponse,
  IUpdateUserProfilePictureRequest,
  IUpdateUserProfilePictureResponse,
  IUpdateUserRequest,
  IUpdateUserResponse
} from '../interfaces/user.interface';
import { IUserModel } from '../models/user.model';
import { KeyNotFoundError } from '../errors/key.error';
import { validateObjectId } from '../validators/objectId';
import { Logger } from '../loggers/logger';
import * as s3 from '../services/s3';

const User: IUserModel = require('../models/user.model');

export const getUser = async (
  req: IGetUserRequest,
  res: IGetUserResponse,
  next: NextFunction
) => {
  const { id, email } = req.query;
  let user;

  try {
    Logger.update('Getting user');

    if (id) {
      validateObjectId(id);

      user = await User.findById(id);

      if (!user) {
        throw new KeyNotFoundError('User not found', 'id', id);
      }
    } else if (email) {
      user = await User.findOne({ email });

      if (!user) {
        throw new KeyNotFoundError('User not found', 'email', email);
      }
    }

    Logger.success('User found', id);

    const response = await user?.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const updateUser = async (
  req: IUpdateUserRequest,
  res: IUpdateUserResponse,
  next: NextFunction
) => {
  const userId = req.params.userId;
  const updates = req.body;

  try {
    Logger.update('Updating user');

    validateObjectId(userId);

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true
    });

    if (!updatedUser) {
      throw new KeyNotFoundError('User not found', 'id', userId);
    }

    Logger.success('User updated', userId);

    const response = await updatedUser?.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const updateProfilePicture = async (
  req: IUpdateUserProfilePictureRequest,
  res: IUpdateUserProfilePictureResponse,
  next: NextFunction
) => {
  const userId = req.params.userId;
  const { profilePic } = req.body;
  const file = req.file as Express.Multer.File;

  try {
    Logger.update('Uploading profile picture to S3');

    const media = { name: profilePic, url: undefined };

    const uploadedMedia = await s3.putMedia(
      userId,
      file,
      media,
      s3.userBucketName
    );

    Logger.update('Updating user');

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedMedia[0] },
      { new: true }
    );

    if (!updatedUser) {
      throw new KeyNotFoundError('User not found', 'id', userId);
    }

    Logger.success('Profile picture updated', userId);

    const response = await updatedUser?.formatResponse();

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
