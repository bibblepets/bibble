import { Request, Response, NextFunction } from 'express';
import { verify, sign } from 'jsonwebtoken';
import { IPopulatedUser, UserModel } from '../models/user/user.model';
import { BibbleError } from '../errors/errors.class';

const User: UserModel = require('../models/user/user.model');

const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7
};

export const getUserFromAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Getting User from Auth Token...');
  const { authToken }: { authToken: string } = req.cookies;

  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    if (!SECRET_JWT_CODE) {
      throw new BibbleError('Secret JWT code not found.');
    }

    const decoded = verify(authToken, SECRET_JWT_CODE);

    if (typeof decoded === 'string') {
      throw new BibbleError('Decoded JWT is a string.');
    }

    const authUser = await User.findById(decoded.id);

    if (!authUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const token = sign(
      { id: authUser._id, email: authUser.email },
      SECRET_JWT_CODE
    );

    const populatedUser = await authUser.populate('buyerProfile businessProfile');

    res.cookie('authToken', token, COOKIE_OPTIONS);
    req.body = {
      ...req.body,
      user: populatedUser
    };
    next();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const validateBibbleTier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Checking Bibble Tier...');
  try {
    const user: IPopulatedUser = req.body.user

    if (user.businessProfile.bibbleTier === 'Basic') {
      return res.status(401).json({
        message: 'You do not have the required minimum Bibble Tier privilleges.'
      });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
