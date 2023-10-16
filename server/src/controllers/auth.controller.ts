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

    const buyerProfileId = user.buyerProfile;
    const businessProfileId = user.businessProfile;

    // Validate request body
    if (buyerProfile) {
      console.log('Validating Buyer Profile request body...');
      await BuyerProfile.validate(buyerProfile, Object.keys(buyerProfile));
    }
    if (businessProfile) {
      // If user has a business profile, validate request body for update
      console.log('Validating Business Profile (Update) request body...');
      if (businessProfileId) {
        await BusinessProfile.validate(
          businessProfile,
          Object.keys(businessProfile)
        );
      } else {
        // If user does not have a business profile, validate request body for create
        console.log('Validating Business Profile (Create) request body...');
        await BusinessProfile.validate(businessProfile);
      }
    }
    if (email || password) {
      console.log('Validating User request body...');
      const userPathsToUpdate = ['email', 'password'].filter(
        (key: string) => req.body[key as keyof typeof req.body]
      );
      await User.validate({ email, password }, userPathsToUpdate);
    }

    // Update Buyer Profile
    console.log('Updating buyer profile...');
    const updatedBuyerProfile = await BuyerProfile.findByIdAndUpdate(
      buyerProfileId,
      buyerProfile,
      { new: true }
    );

    if (!updatedBuyerProfile) {
      return res.status(404).json({ message: 'Buyer profile not found.' });
    }

    // Update Business Profile
    let updatedBusinessProfile;
    if (businessProfile) {
      if (businessProfileId) {
        // If request body contains business profile and user has business profile, update business profile
        console.log('Updating business profile...');
        updatedBusinessProfile = await BusinessProfile.findByIdAndUpdate(
          businessProfileId,
          businessProfile,
          { new: true }
        );
      } else {
        console.log('Creating business profile...');
        // If request body contains business profile and user does not have business profile, create business profile
        updatedBusinessProfile = await BusinessProfile.create(businessProfile);
      }
    }

    if (!updatedBusinessProfile) {
      return res.status(404).json({ message: 'Business profile not found.' });
    }

    // Update User
    if (businessProfile && businessProfileId) {
      // If request body contains business profile and user has business profile, update user
      console.log('Updating user...');
      await user.updateOne({
        buyerProfile: updatedBuyerProfile._id,
        businessProfile: updatedBusinessProfile._id,
        email,
        password
      });
    } else if (businessProfile && !businessProfileId) {
      // If request body contains business profile and user does not have business profile, replace user
      console.log('Replacing user...');
      await user.replaceOne({
        buyerProfile: buyerProfile
          ? updatedBuyerProfile._id
          : user.buyerProfile,
        businessProfile: updatedBusinessProfile?._id,
        email: email || user.email,
        password: password || user.password,
        createdAt: user.createdAt
      });
    }

    const updatedUser = await User.findById(id);
    const populatedUser = await updatedUser?.populate(
      'buyerProfile businessProfile'
    );

    return res.json({
      user: populatedUser,
      message: 'User updated successfully.'
    });
  } catch (error: any) {
    return handleError(res, error);
  }
};
