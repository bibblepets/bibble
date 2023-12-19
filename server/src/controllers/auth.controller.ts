import { Request, Response } from 'express';
import { verify, sign } from 'jsonwebtoken';
import { BibbleError } from '../errors/errors.class';
import { handleError } from '../utils/util';
import {
  ICreateUserRequest,
  IUpdateUserRequest,
  ICheckAuthStatusRequest,
  ILoginUserRequest,
  UserModel
} from '../models/user/user.model';
import { BuyerProfileModel } from '../models/user/buyer-profile.model';
import { BusinessProfileModel } from '../models/user/business-profile.model';

const User: UserModel = require('../models/user/user.model');
const BuyerProfile: BuyerProfileModel = require('../models/user/buyer-profile.model');
const BusinessProfile: BusinessProfileModel = require('../models/user/business-profile.model');

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

export const registerUser = async (req: ICreateUserRequest, res: Response) => {
  const { buyerProfile, businessProfile, email, password } = req.body;
  let createdBuyerProfile;
  let createdBusinessProfile;
  let createdUser;
  try {
    if (!SECRET_JWT_CODE) {
      throw new BibbleError('Secret JWT code not found.');
    }

    // Validate request body
    console.log('Validating request body...');
    await BuyerProfile.validate(buyerProfile);
    if (businessProfile) {
      await BusinessProfile.validate(businessProfile);
    }
    await User.validate({ email, password }, ['email', 'password']);
    console.log('Request body validated.');

    // Create Buyer Profile
    console.log('Creating buyer profile...');
    createdBuyerProfile = await BuyerProfile.create(buyerProfile);
    console.log('Buyer profile created.', createdBuyerProfile._id);

    // Create Business Profile
    console.log('Creating business profile...');
    if (businessProfile) {
      createdBusinessProfile = await BusinessProfile.create(businessProfile);
      console.log('Business profile created.', createdBusinessProfile._id);
    } else {
      createdBusinessProfile = await BusinessProfile.create({});
      console.log('Default Business profile not created.');
    }

    // Create User
    console.log('Creating user...');
    createdUser = await User.create({
      buyerProfile: createdBuyerProfile._id,
      businessProfile: createdBusinessProfile._id,
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
    if (createdUser) {
      console.log('Deleting user...');
      await createdUser.deleteOne();
      console.log('User deleted.');
    }
    if (createdBusinessProfile) {
      console.log('Deleting business profile...');
      await createdBusinessProfile.deleteOne();
      console.log('Business profile deleted.');
    }
    if (createdBuyerProfile) {
      console.log('Deleting buyer profile...');
      await createdBuyerProfile.deleteOne();
      console.log('Buyer profile deleted.');
    }
    return handleError(res, error);
  }
};

export const loginUser = async (req: ILoginUserRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!SECRET_JWT_CODE) {
      throw new BibbleError('Secret JWT code not found.');
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

export const updateUser = async (req: IUpdateUserRequest, res: Response) => {
  const { user, buyerProfile, businessProfile, email, password } = req.body;

  try {
    const buyerProfileId = user.buyerProfile._id;
    const businessProfileId = user.businessProfile._id;

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
    console.log('Updating business profile...');
    const updatedBusinessProfile = await BusinessProfile.findByIdAndUpdate(
      businessProfileId,
      businessProfile,
      { new: true }
    );

    if (!updatedBusinessProfile) {
      return res.status(404).json({ message: 'Business profile not found.' });
    }

    // Update User
    console.log('Updating user...');
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        buyerProfile: updatedBuyerProfile._id,
        businessProfile: updatedBusinessProfile._id,
        email,
        password
      },
      { new: true }
    );

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
