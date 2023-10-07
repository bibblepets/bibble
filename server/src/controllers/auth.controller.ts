import { Request, Response } from 'express';
import { verify, sign } from 'jsonwebtoken';
import { Error } from 'mongoose';
import { handleError } from '../utils/util';
import User, {
  ICreateOrUpdateUserRequest,
  ICheckAuthStatusRequest,
  ILoginUserRequest,
} from '../models/user/user.model';
import BuyerProfile from '../models/user/buyerProfile.model';
import BusinessProfile from '../models/user/businessProfile.model';

const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7
};

const checkAuthStatus = async (req: ICheckAuthStatusRequest, res: Response) => {
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

    const populatedUser = await authUser.populate('buyerProfile businessProfile');

    return res
      .cookie('authToken', token, COOKIE_OPTIONS)
      .json({ token: token, currentUser: populatedUser, message: 'User is authenticated.' });
  } catch (error: any) {
    return handleError(res, error);
  }
};

const registerUser = async (req: ICreateOrUpdateUserRequest, res: Response) => {
  const { buyerProfile, businessProfile, email, password } = req.body;
  console.log('--REGISTER USER--');
  try {
    if (!SECRET_JWT_CODE) {
      throw new Error('Secret JWT code not found.');
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
    const createdBuyerProfile = await BuyerProfile.create(buyerProfile);
    console.log('Buyer profile created.', createdBuyerProfile._id);

    // Create Business Profile
    console.log('Creating business profile...');
    let createdBusinessProfile;
    if (businessProfile) {
      createdBusinessProfile = await BusinessProfile.create(businessProfile);
      console.log('Business profile created.', createdBusinessProfile._id);
    } else {
      console.log('Business profile not created.');
    }

    // Create User
    console.log('Creating user...');
    const createdUser = await User.create({
      buyerProfile: createdBuyerProfile._id,
      businessProfile: createdBusinessProfile?._id,
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

    const populatedUser = await createdUser.populate('buyerProfile businessProfile');

    return res
      .cookie('authToken', token, COOKIE_OPTIONS)
      .json({ token: token, currentUser: populatedUser, message: 'User registered successfully.' });
  } catch (error: any) {
    return handleError(res, error);
  }
};

const loginUser = async (req: ILoginUserRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!SECRET_JWT_CODE) {
      throw new Error('Secret JWT code not found.');
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.isCorrectPassword(password)) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const token = sign({ id: user._id, email: user.email }, SECRET_JWT_CODE);

    const populatedUser = await user.populate('buyerProfile businessProfile');

    return res
      .cookie('authToken', token, COOKIE_OPTIONS)
      .json({ token: token, currentUser: populatedUser, message: 'User logged in successfully.' });
  } catch (error: any) {
    return handleError(res, error);
  }
};

const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie('authToken', COOKIE_OPTIONS);

  res.json({
    message: 'User logged out successfully.'
  });
};

const updateUser = async (req: ICreateOrUpdateUserRequest, res: Response) => {
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
      console.log('Validating Business Profile (Update) request body...')
      if (businessProfileId) {
        await BusinessProfile.validate(
          businessProfile,
          Object.keys(businessProfile)
        );
      } else {
        // If user does not have a business profile, validate request body for create
        console.log('Validating Business Profile (Create) request body...')
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
        console.log('Updating business profile...')
        updatedBusinessProfile = await BusinessProfile.findByIdAndUpdate(
          businessProfileId,
          businessProfile,
          { new: true }
        );
      } else {
        console.log('Creating business profile...')
        // If request body contains business profile and user does not have business profile, create business profile
        updatedBusinessProfile = await BusinessProfile.create(businessProfile);
      }
    }

    if (!updatedBusinessProfile) {
      return res
        .status(404)
        .json({ message: 'Business profile not found.' });
    }

    // Update User
    if (businessProfile && businessProfileId) {
      // If request body contains business profile and user has business profile, update user
      console.log('Updating user...')
      user.updateOne({
        buyerProfile: updatedBuyerProfile._id,
        businessProfile: updatedBusinessProfile._id,
        email,
        password
      });
    } else if (businessProfile && !businessProfileId) {
      // If request body contains business profile and user does not have business profile, replace user
      console.log('Replacing user...')
      await user.replaceOne({
        buyerProfile: buyerProfile
          ? updatedBuyerProfile._id
          : user.buyerProfile,
        businessProfile: updatedBusinessProfile?._id,
        email: email ? email : user.email,
        password: password ? password : user.password,
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

module.exports = {
  checkAuthStatus,
  registerUser,
  loginUser,
  logoutUser,
  updateUser
};
