import { NextFunction } from 'express';
import { IAuthRequest, IAuthResponse } from '../interfaces/auth.interface';
import { AuthTokenError } from '../errors/auth.error';
import { signAuthToken, verifyAuthToken } from '../services/jwt';
import { IUserModel } from '../models/user.model';

const User: IUserModel = require('../models/user.model');

export const authHandler = async (
  req: IAuthRequest,
  res: IAuthResponse,
  next: NextFunction
) => {
  const authToken = req.cookies.authToken;

  try {
    if (!authToken) {
      throw new AuthTokenError("Auth token doesn't exist");
    }

    const decodedToken = verifyAuthToken(authToken);

    const user = await User.findById(decodedToken.id);

    if (!user) {
      throw new AuthTokenError('Invalid auth token');
    }

    signAuthToken(req, res, user._id);

    next();
  } catch (error: any) {
    next(error);
  }
};
