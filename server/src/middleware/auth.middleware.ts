import { Request, Response, NextFunction } from 'express';
import { verify, sign } from 'jsonwebtoken';
import { IUser, UserModel } from '../models/user/user.model';
import { IBuyerProfile } from '../models/user/buyer-profile.model';
import { IBusinessProfile } from '../models/user/business-profile.model';

const User: UserModel = require('../models/user/user.model');

const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7
};

export const checkBibbleTier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Checking Bibble Tier...');
  const { authToken }: { authToken: string } = req.cookies;

  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    if (!SECRET_JWT_CODE) {
      throw new Error('Secret JWT code not found.');
    }

    const decoded = verify(authToken, SECRET_JWT_CODE);

    if (typeof decoded === 'string') {
      throw new Error('Decoded JWT is a string.');
    }

    const authUser = await User.findById(decoded.id);

    if (!authUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const token = sign(
      { id: authUser._id, email: authUser.email },
      SECRET_JWT_CODE
    );

    const populatedUser: IUser & {
      buyerProfile: IBuyerProfile;
      businessProfile: IBusinessProfile;
    } = await authUser.populate('buyerProfile businessProfile');

    if (!populatedUser.businessProfile) {
      return res
        .status(401)
        .json({
          message: 'Please create a Business Profile to access this privillege.'
        });
    } else if (populatedUser.businessProfile.bibbleTier === 'Basic') {
      return res
        .status(401)
        .json({
          message:
            'You do not have the required minimum Bibble Tier privilleges.'
        });
    }

    res.cookie('authToken', token, COOKIE_OPTIONS);
    next();
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
