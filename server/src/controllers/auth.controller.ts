import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { IBusinessProfile } from '../models/user/businessProfile.model';
import { IBuyerProfile } from '../models/user/buyerProfile.model';
import { IUser } from '../models/user/user.model';

const jwt = require('jsonwebtoken');
const User: Model<IUser> = require('../models/user/user.model');

const { validateEmail, handleError } = require('../utils/util');
const {
  createBuyerProfile,
  createBusinessProfile,
  deleteProfiles,
  updateBuyerProfile,
  updateBusinessProfile
}: {
  createBuyerProfile: (req: Request) => Promise<IBuyerProfile>;
  createBusinessProfile: (req: Request) => Promise<IBusinessProfile>;
  deleteProfiles: (req: Request) => Promise<void>;
  updateBuyerProfile: (req: Request) => Promise<IBuyerProfile>;
  updateBusinessProfile: (req: Request) => Promise<IBusinessProfile>;
} = require('./profile.controller');

const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7
};

export const checkAuthStatus = async (
  req: ICheckAuthStatusRequest,
  res: Response
) => {
  const { authToken } = req.cookies;

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

    const populatedUser = await authUser.populate(
      'buyerProfile businessProfile'
    );

    return res.cookie('authToken', token, COOKIE_OPTIONS).json({
      token: token,
      currentUser: populatedUser,
      message: 'User is authenticated.'
    });
  } catch (error: any) {
    return handleError(res, error);
  }
};

const registerUser = async (req: Request, res: Response) => {
  const {
    email,
    password,
    buyerProfile: { firstName, lastName }
  } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ message: 'The email address provided is invalid.' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters long.' });
  }

  if (!req.body.buyerProfile) {
    return res
      .status(400)
      .json({ message: 'Please provide buyer profile information.' });
  }

  if (req.body.businessProfile) {
    const { businessEmail } = req.body.businessProfile;
    if (businessEmail && !validateEmail(businessEmail)) {
      return res
        .status(400)
        .json({ message: 'The business email address provided is invalid.' });
    }
  }

  try {
    const buyerProfile = await createBuyerProfile(req);
    const businessProfile = req.body.businessProfile
      ? await createBusinessProfile(req)
      : undefined;

    const user = new User({
      buyerProfile: buyerProfile._id,
      businessProfile: businessProfile?._id,
      email,
      password
    });
    console.log('User created.', createdUser._id);

    // Create JWT
    console.log('Creating JWT...');
    const token = sign(
      { id: createdUser._id, email: createdUser.email },
      SECRET_JWT_CODE
    );
    console.log('JWT created.');

    const populatedUser = await createdUser.populate(
      'buyerProfile businessProfile'
    );

    return res.cookie('authToken', token, COOKIE_OPTIONS).json({
      token: token,
      currentUser: populatedUser,
      message: 'User registered successfully.'
    });
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const loginUser = async (req: ILoginUserRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!SECRET_JWT_CODE) {
      throw new Error('Secret JWT code not found.');
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.isCorrectPassword(password)) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const token = sign({ id: user._id, email: user.email }, SECRET_JWT_CODE);

    const populatedUser = await user.populate('buyerProfile businessProfile');

    return res.cookie('authToken', token, COOKIE_OPTIONS).json({
      token: token,
      currentUser: populatedUser,
      message: 'User logged in successfully.'
    });
  } catch (error: any) {
    return handleError(res, error);
  }
};

export const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie('authToken', COOKIE_OPTIONS);

  res.json({
    message: 'User logged out successfully.'
  });
};

export const updateUser = async (
  req: ICreateOrUpdateUserRequest,
  res: Response
) => {
  const { id } = req.params;
  const { buyerProfile, businessProfile, email, password } = req.body;

  try {
    // Get User Document
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

      req.params.buyerProfileId = (user.buyerProfile as any)._id.toString();
      user.buyerProfile = await updateBuyerProfile(req).then(
        (profile) => profile._id
      );

      if (user.businessProfile) {
        req.params.businessProfileId = user.businessProfile.toString();
      }

      if (req.body.businessProfile) {
        if (user.businessProfile) {
          console.log('Updating business profile...');
          user.businessProfile = await updateBusinessProfile(req).then(
            (profile) => profile._id
          );
        } else {
          console.log('Creating business profile...');
          user.businessProfile = await createBusinessProfile(req).then(
            (profile) => profile._id
          );
          console.log('SHOULD NOT BE BULL ->', user.businessProfile);
        }
      }

      await user.save().then((user: IUser) => console.log(user));
      console.log('User Profiles updated.');

      console.log('User updated:', user._id.toString());
      return res.status(200).json(user);
    })
    .catch((error: any) => {
      console.log('Error updating User:');
      console.log(error.message);
      return handleError(req, res, error);
    });
};

module.exports = {
  checkAuthStatus,
  registerUser,
  loginUser,
  logoutUser,
  updateUser
};
