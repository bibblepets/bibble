import { compareSync, hashSync } from 'bcrypt';
import { Request, Response } from 'express';
import { IUser } from '../models/user.model';

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7
};

const checkAuthStatus = async (req: Request, res: Response) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.json({ isAuthenticated: false, message: 'User not logged in.' });
  }

  const decoded = jwt.verify(token, SECRET_JWT_CODE);

  await User.findById(decoded.id)
    .then((user: IUser) => {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        SECRET_JWT_CODE
      );
      res.cookie('authToken', token, COOKIE_OPTIONS);
      res.json({ isAuthenticated: true, token, currentUser: user });
    })
    .catch((error: Error) => {
      res.json({ isAuthenticated: false, message: error.message });
    });
};

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      isAuthenticated: false,
      message: 'Please enter name, email and password.'
    });
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
      res.cookie('authToken', token, COOKIE_OPTIONS);
      res.json({ isAuthenticated: true, token, currentUser: user });
    })
    .catch((error: Error) => {
      res.json({ isAuthenticated: false, message: error.message });
    });
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      isAuthenticated: false,
      message: 'Please enter email and password.'
    });
  }

  await User.findOne({ email })
    .then((user: IUser) => {
      if (!user) {
        res.json({ isAuthenticated: false, message: 'User not found.' });
      }

      if (!compareSync(password, user.password)) {
        res.json({ isAuthenticated: false, message: 'Wrong password.' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        SECRET_JWT_CODE
      );
      res.cookie('authToken', token, COOKIE_OPTIONS);

      res.json({ isAuthenticated: true, token, currentUser: user });
    })
    .catch((error: Error) => {
      res.json({ isAuthenticated: false, message: error.message });
    });
};

const logoutUser = (_req: Request, res: Response) => {
  res.clearCookie('authToken', COOKIE_OPTIONS);

  res.json({
    isAuthenticated: false,
    message: 'Logged out successfully'
  });
};

module.exports = {
  checkAuthStatus,
  registerUser,
  loginUser,
  logoutUser
};
