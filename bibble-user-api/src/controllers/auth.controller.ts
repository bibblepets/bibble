import { NextFunction } from 'express';
import {
  ILoginUserRequest,
  ILoginUserResponse,
  ILogoutUserRequest,
  ILogoutUserResponse,
  IRegisterUserRequest,
  IRegisterUserResponse
} from '../interfaces/user.interface';
import { Logger } from '../loggers/logger';
import { IUserModel } from '../models/user.model';
import {
  deleteAuthToken,
  signAuthToken,
  verifyAuthToken
} from '../services/jwt';
import { KeyNotFoundError, UniqueKeyError } from '../errors/key.error';
import { AuthTokenError, PasswordError } from '../errors/auth.error';
import { IAuthRequest, IAuthResponse } from '../interfaces/auth.interface';

const User: IUserModel = require('../models/user.model');

export const authenticate = async (
  req: IAuthRequest,
  res: IAuthResponse,
  next: NextFunction
) => {
  const authToken = req.cookies.authToken;

  try {
    Logger.update('Authenticating user');

    if (!authToken) {
      throw new AuthTokenError("Auth token doesn't exist");
    }

    const decodedToken = verifyAuthToken(authToken);

    const user = await User.findById(decodedToken.id);

    if (!user) {
      throw new AuthTokenError('Invalid auth token');
    }

    signAuthToken(req, res, user._id);

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

    signAuthToken(req, res, createdUser._id);

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

    signAuthToken(req, res, user._id);

    Logger.success('User logged in', user._id);

    const response = await user.formatResponse();

    return res.status(200).json(response);
  } catch (error: any) {
    next(error);
  }
};

export const logoutUser = (
  _req: ILogoutUserRequest,
  res: ILogoutUserResponse
) => {
  Logger.update('Logging out user');

  deleteAuthToken(res);

  Logger.success('User logged out');

  return res.status(200).json('User logged out successfully');
};
