import { compareSync, hashSync } from 'bcrypt';
import { Request, Response } from 'express';
import { IUser } from '../models/user/user.model';
import { IBuyerProfile } from '../models/user/buyerProfile.model';
import { IBusinessProfile } from '../models/user/businessProfile.model';

const jwt = require('jsonwebtoken');
const User = require('../models/user/user.model');

const { validateEmail, handleError } = require('../utils/util');
const {
  createProfiles,
  deleteProfiles,
  updateProfiles
} = require('./profile.controller');

const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7
};

const checkAuthStatus = async (req: Request, res: Response) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'User is not logged in.' });
  }

  const decoded = jwt.verify(token, SECRET_JWT_CODE);

  await User.findById(decoded.id)
    .then((user: IUser) => {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        SECRET_JWT_CODE
      );
      return res
        .cookie('authToken', token, COOKIE_OPTIONS)
        .json({ isAuthenticated: true, token, currentUser: user });
    })
    .catch((error: any) => {
      return res.status(500).json({ message: error.message });
    });
};

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const buyerProfileParams: IBuyerProfile = req.body.buyerProfile;
  const businessProfileParams: IBusinessProfile = req.body.businessProfile;

  if (!name || !email || !password) {
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

  if (!buyerProfileParams) {
    return res
      .status(400)
      .json({ message: 'Please provide buyer profile information.' });
  }

  if (businessProfileParams.businessEmail) {
    if (!validateEmail(businessProfileParams.businessEmail)) {
      return res
        .status(400)
        .json({ message: 'The business email address provided is invalid.' });
    }
  }

  try {
    const { buyerProfile, businessProfile } = await createProfiles(
      buyerProfileParams,
      businessProfileParams
    );

    const user = new User({
      buyerProfile: buyerProfile._id,
      businessProfile: businessProfile._id,
      name,
      email,
      password: hashSync(password, 10)
    });

    await user
      .save()
      .then((user: IUser) => {
        console.log('User created:', user._id.toString());
        const token = jwt.sign(
          { id: user._id, email: user.email },
          SECRET_JWT_CODE
        );
        console.log('Token created:', token);
        return res
          .cookie('authToken', token, COOKIE_OPTIONS)
          .json({ isAuthenticated: true, token, currentUser: user });
      })
      .catch(async (error: any) => {
        console.log('Error creating User:');
        await deleteProfiles(buyerProfile, businessProfile);
        throw error;
      });
  } catch (error: any) {
    return handleError(req, res, error);
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  if (!validateEmail(email)) {
    return res
      .status(400)
      .json({ message: 'Please enter a valid email address.' });
  }

  await User.findOne({ email })
    .then((user: IUser) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      if (!compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Incorrect password.' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        SECRET_JWT_CODE
      );

      return res
        .cookie('authToken', token, COOKIE_OPTIONS)
        .json({ isAuthenticated: true, token, currentUser: user });
    })
    .catch((error: any) => {
      return res.status(500).json({ message: error.message });
    });
};

const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie('authToken', COOKIE_OPTIONS);

  res.json({
    isAuthenticated: false,
    message: 'Logged out successfully'
  });
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (email && !validateEmail(email)) {
    return res
      .status(400)
      .json({ message: 'The email address provided is invalid.' });
  }

  if (password && password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 6 characters long.' });
  }

  if (
    req.body.businessProfile &&
    !validateEmail(req.body.businessProfile.businessEmail)
  ) {
    return res
      .status(400)
      .json({ message: 'The business email address provided is invalid.' });
  }

  try {
    await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        password: password ? hashSync(password, 10) : undefined
      },
      { new: true, runValidators: true }
    )
      .then(async (user: IUser) => {
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
    

        req.params.buyerProfileId = (user.buyerProfile as any)._id.toString();
        if (user.businessProfile) {
          req.params.businessProfileId = (user.businessProfile as any)._id.toString();
        }
        const {buyerProfile, businessProfile } = await updateProfiles(req);
        user.buyerProfile = buyerProfile;
        user.businessProfile = businessProfile;
        
        console.log('User updated:', user._id.toString());
        return res.status(200).json(await User.findById(id));
      })
      .catch((error: any) => {
        console.log('Error updating User:');
        console.log(error);
        return handleError(req, res, error);
      });
  } catch (error: any) {
    return handleError(req, res, error);
  }
};

module.exports = {
  checkAuthStatus,
  registerUser,
  loginUser,
  logoutUser,
  updateUser
};
