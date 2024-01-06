import { NextFunction } from 'express';
import {
  IGetUserRequest,
  IGetUserResponse
} from '../interfaces/user.interface';
import { IUserModel } from '../models/user.model';
import { KeyNotFoundError } from '../errors/key.error';
import { Types } from 'mongoose';
import { ValidationError } from '../errors/validation.error';

const User: IUserModel = require('../models/user.model');

export const getUser = async (
  req: IGetUserRequest,
  res: IGetUserResponse,
  next: NextFunction
) => {
  const { id, email } = req.query;
  let user;

  try {
    if (id) {
      if (!Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid query parameter', 'id', id);
      }

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

    return res.status(200).json(user);
  } catch (error: any) {
    next(error);
  }
};
