import { NextFunction } from 'express';
import { KeyNotFoundError, UniqueKeyError } from '../errors/key.error';
import {
  IAppendUserRequest,
  IAppendUserResponse,
  IGetUserRequest,
  IGetUserResponse,
  IUpdateUserProfilePictureRequest,
  IUpdateUserProfilePictureResponse,
  IUpdateUserRequest,
  IUpdateUserResponse
} from '../interfaces/user.interface';
import User from '../models/user.model';
import { Logger } from '../services/logger';
import * as s3 from '../services/s3';
import { validateObjectId } from '../validators/objectId';

export const getUser = async (
  req: IGetUserRequest,
  res: IGetUserResponse,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    let user;

    Logger.update('Getting user');

    if (userId) {
      validateObjectId(userId);

      user = await User.findById(userId);

      if (!user) {
        throw new KeyNotFoundError('User not found', 'id', userId);
      }
    }

    if (!user) {
      throw new KeyNotFoundError('User not found', 'id', userId);
    }

    Logger.success('User found', user?._id.toString());

    const response = await user?.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateUser = async (
  req: IUpdateUserRequest,
  res: IUpdateUserResponse,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    Logger.update('Updating user');

    validateObjectId(userId);

    const existingUser = await User.findOne({ email: updates.email });

    if (existingUser) {
      throw new UniqueKeyError('User already exists', 'email', updates.email!);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedUser) {
      throw new KeyNotFoundError('User not found', 'id', userId);
    }

    Logger.success('User updated', userId);

    const response = await updatedUser?.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateUserProfilePicture = async (
  req: IUpdateUserProfilePictureRequest,
  res: IUpdateUserProfilePictureResponse,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const { media: name } = req.body;
    const file = req.file as Express.Multer.File;

    Logger.update('Uploading profile picture to S3');

    const media = { name };

    const uploadedMedia = await s3.putMedia(
      userId,
      file,
      media,
      s3.USER_BUCKET_NAME
    );

    Logger.update('Updating user');

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedMedia[0] },
      { new: true, runValidators: true }
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

export const appendUsers = async (
  req: IAppendUserRequest,
  res: IAppendUserResponse,
  next: NextFunction
) => {
  try {
    const body = req.body;

    Logger.update('Appending users');

    const appendedUsers = await Promise.all(
      body.map(async (item) => {
        const user = await User.findById(item.userId);
        const formattedUser = await user?.formatResponse();

        return { ...item, user: formattedUser };
      })
    );

    Logger.success('Users appended');

    const response = appendedUsers;

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};
