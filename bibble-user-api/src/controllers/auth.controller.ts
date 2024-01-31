import { NextFunction } from 'express';
import { PasswordError } from '../errors/auth.error';
import { KeyNotFoundError, UniqueKeyError } from '../errors/key.error';
import {
  IAuthBusinessRequest,
  IAuthBusinessResponse,
  IAuthUserRequest,
  IAuthUserResponse
} from '../interfaces/auth.interface';
import {
  ILoginBusinessRequest,
  ILoginBusinessResponse,
  IRegisterBusinessRequest,
  IRegisterBusinessResponse
} from '../interfaces/business.interface';
import {
  ILoginUserRequest,
  ILoginUserResponse,
  IRegisterUserRequest,
  IRegisterUserResponse
} from '../interfaces/user.interface';
import Business from '../models/business.model';
import User from '../models/user.model';
import { Logger } from '../services/logger';

export const authenticateUser = async (
  req: IAuthUserRequest,
  res: IAuthUserResponse,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    Logger.update('Authenticating user');

    const user = await User.findById(userId);

    if (!user) {
      throw new KeyNotFoundError('User not found', 'id', userId);
    }

    Logger.success('User authenticated', user._id.toString());

    const response = await user.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const registerUser = async (
  req: IRegisterUserRequest,
  res: IRegisterUserResponse,
  next: NextFunction
) => {
  let createdUser;

  try {
    const { firstName, lastName, email, password } = req.body;

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

    Logger.success('User created', createdUser._id.toString());

    const response = await createdUser.formatResponse();

    return res.status(201).json(response);
  } catch (error: unknown) {
    if (createdUser) {
      await createdUser.deleteOne();
      Logger.update('User deleted', createdUser._id.toString());
    }

    next(error);
  }
};

export const loginUser = async (
  req: ILoginUserRequest,
  res: ILoginUserResponse,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    Logger.update('Logging in user');

    const user = await User.findOne({ email });

    if (!user) {
      throw new KeyNotFoundError('User not found', 'email', email);
    }

    if (!user.isCorrectPassword(password)) {
      throw new PasswordError();
    }

    Logger.success('User logged in', user._id.toString());

    const response = await user.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const authenticateBusiness = async (
  req: IAuthBusinessRequest,
  res: IAuthBusinessResponse,
  next: NextFunction
) => {
  try {
    const { businessId } = req.params;

    Logger.update('Authenticating business');

    const business = await Business.findById(businessId);

    if (!business) {
      throw new KeyNotFoundError('Business not found', 'id', businessId);
    }

    Logger.success('Business authenticated', business._id.toString());

    const response = await business.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};

export const registerBusiness = async (
  req: IRegisterBusinessRequest,
  res: IRegisterBusinessResponse,
  next: NextFunction
) => {
  let createdBusiness;

  try {
    const business = req.body;
    console.log(req.body);
    const { email } = business;

    Logger.update('Creating business');

    const existingBusiness = await Business.findOne({ email });

    if (existingBusiness) {
      throw new UniqueKeyError('Business already exists', 'email', email);
    }

    createdBusiness = await Business.create(business);

    Logger.success('Business created', createdBusiness._id.toString());

    const response = await createdBusiness.formatResponse();

    return res.status(201).json(response);
  } catch (error: unknown) {
    if (createdBusiness) {
      await createdBusiness.deleteOne();
      Logger.update('User deleted', createdBusiness._id.toString());
    }

    next(error);
  }
};

export const loginBusiness = async (
  req: ILoginBusinessRequest,
  res: ILoginBusinessResponse,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    Logger.update('Logging in business');

    const business = await Business.findOne({ email });

    if (!business) {
      throw new KeyNotFoundError('Business not found', 'email', email);
    }

    if (!business.isCorrectPassword(password)) {
      throw new PasswordError();
    }

    Logger.success('Business logged in', business._id.toString());

    const response = await business.formatResponse();

    return res.status(200).json(response);
  } catch (error: unknown) {
    next(error);
  }
};
