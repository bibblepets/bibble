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
    return res.json({ success: false });
  }

  try {
    const decoded = jwt.verify(token, SECRET_JWT_CODE);

    const response = await User.findById(decoded.id)
      .then((user: IUser) => {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          SECRET_JWT_CODE
        );
        res.cookie('authToken', token, COOKIE_OPTIONS);
        return { success: true, token, currentUser: user };
      })
      .catch((error: Error) => {
        return { success: false, message: error.message };
      });
    return res.json(response);
  } catch (error: any) {
    return res.json({ success: false, message: error.message });
  }
};

const authenticateUser = async (req: Request, res: Response) => {
  const { type } = req.body;

  if (type === 'register') {
    return await registerUser(req, res);
  } else if (type === 'login') {
    return await loginUser(req, res);
  } else {
    return res.json({ success: false, message: 'Invalid request type.' });
  }
};

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
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
      return res.json({ success: true, token, currentUser: user });
    })
    .catch((error: Error) => {
      return res.json({ success: false, message: error.message });
    });
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: 'Please enter email and password.'
    });
  }

  const response = await User.findOne({ email: email })
    .then((user: IUser) => {
      if (!user) {
        return { success: false, message: 'User not found.' };
      }

      if (!compareSync(password, user.password)) {
        return { success: false, message: 'Wrong password.' };
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        SECRET_JWT_CODE
      );
      res.cookie('authToken', token, COOKIE_OPTIONS);

      return { success: true, token, currentUser: user };
    })
    .catch((error: Error) => {
      return { success: false, message: error.message };
    });

  return res.json(response);
};

const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('authToken', COOKIE_OPTIONS);
  return res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
  checkAuthStatus,
  authenticateUser,
  logoutUser
};
