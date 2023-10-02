import { compareSync, hashSync } from 'bcrypt';
import { Request, Response } from 'express';
import { IUser } from '../models/user/user.model';

const jwt = require('jsonwebtoken');
const User = require('../models/user/user.model');

const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7
};

const checkAuthStatus = async (req: Request, res: Response) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'User is not logged in.'});
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

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  await User.create({
    name,
    email,
    password: hashSync(password, 10)
  })
    .then((user: IUser) => {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        SECRET_JWT_CODE
      );
      return res.cookie('authToken', token, COOKIE_OPTIONS).json({ isAuthenticated: true, token, currentUser: user });
    })
    .catch((error: any) => {
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Email already exists.' });
      }
      return res.status(500).json({ message: error.message });
    });
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
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

const validateEmail = (email: string) => {
  return RegExp(/^(([^<>()[\]\\.,;:\s@"]+\.?)|(".+"))@(([a-zA-Z\d-]+\.)+[a-zA-Z]{2,})$/)
    .exec(String(email).toLowerCase());
};

module.exports = {
  checkAuthStatus,
  registerUser,
  loginUser,
  logoutUser
};
