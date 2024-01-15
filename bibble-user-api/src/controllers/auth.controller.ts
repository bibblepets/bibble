import { NextFunction } from 'express';
import {
  ILoginUserRequest,
  ILoginUserResponse,
  IRegisterUserRequest,
  IRegisterUserResponse
} from '../interfaces/user.interface';
import { Logger } from '../services/logger';
import { IUserModel } from '../models/user.model';
import { KeyNotFoundError, UniqueKeyError } from '../errors/key.error';
import { PasswordError } from '../errors/auth.error';
import { IAuthRequest, IAuthResponse } from '../interfaces/auth.interface';

const User: IUserModel = require('../models/user.model');

export const authenticate = async (
  req: IAuthRequest,
  res: IAuthResponse,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    Logger.update('Authenticating user');

    const user = await User.findById(userId);

    if (!user) {
      throw new KeyNotFoundError('User not found', 'id', userId);
    }

    Logger.success('User authenticated', user._id);

    const response = await user.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const registerUser = async (
  req: IRegisterUserRequest,
  res: IRegisterUserResponse,
  next: NextFunction
) => {
  const { firstName, lastName, email, password } = req.body;
  let createdUser;

  try {
    Logger.update('Creating user');

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new UniqueKeyError('User already exists', 'email', email);
    }

    createdUser = await User.create({
      firstName,
      lastName,
      email,
      password
    });

    Logger.success('User created', createdUser._id);

    const response = await createdUser.formatResponse();

    return res.status(201).json(response);
  } catch (error: any) {
    if (createdUser) {
      await createdUser.deleteOne();
      Logger.update('User deleted', createdUser._id);
    }

    next(error);
  }
};

export const loginUser = async (
  req: ILoginUserRequest,
  res: ILoginUserResponse,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    Logger.update('Logging in user');

    const user = await User.findOne({ email });

    if (!user) {
      throw new KeyNotFoundError('User not found', 'email', email);
    }

    if (!user.isCorrectPassword(password)) {
      throw new PasswordError();
    }

    Logger.success('User logged in', user._id);

    const response = await user.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};
