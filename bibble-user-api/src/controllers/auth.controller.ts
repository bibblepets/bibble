import { NextFunction } from 'express';
import {
  IRegisterUserRequest,
  IRegisterUserResponse
} from '../interfaces/user.interface';
import { Logger } from '../loggers/logger';
import { IUserModel } from '../models/user.model';
import { signAuthToken } from '../services/jwt';
import { UniqueKeyError } from '../errors/database.error';

const User: IUserModel = require('../models/user.model');

export const registerUser = async (
  req: IRegisterUserRequest,
  res: IRegisterUserResponse,
  next: NextFunction
) => {
  const { email, password } = req.body;
  let createdUser;

  try {
    Logger.update('Creating user.');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new UniqueKeyError('User already exists.', email);
    }

    createdUser = await User.create({
      email,
      password
    });
    Logger.success('User created.', createdUser._id);

    signAuthToken(req, res, createdUser._id);

    return res.status(201).json(createdUser);
  } catch (error: any) {
    if (createdUser) {
      await createdUser.deleteOne();
      Logger.update('User deleted.', createdUser._id);
    }

    next(error);
  }
};
