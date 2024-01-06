import jwt from 'jsonwebtoken';
import {
  ILogoutUserResponse,
  IRegisterUserRequest,
  IRegisterUserResponse
} from '../interfaces/user.interface';
import { Schema } from 'mongoose';
import { Logger } from '../loggers/logger';
import { ServerError } from '../errors/server.error';

const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7
};

export function signAuthToken(
  req: IRegisterUserRequest,
  res: IRegisterUserResponse,
  id: Schema.Types.ObjectId
) {
  if (!SECRET_JWT_CODE) {
    throw new ServerError('SECRET_JWT_CODE not found.');
  }

  const { email } = req.body;
  const token = jwt.sign({ id, email }, SECRET_JWT_CODE);
  Logger.success('Auth token created.', token);

  res.cookie('authToken', token, COOKIE_OPTIONS);
  Logger.success('Auth token set.', token);
}

export function deleteAuthToken(res: ILogoutUserResponse) {
  res.clearCookie('authToken', COOKIE_OPTIONS);
  Logger.success('Auth token deleted.');
}
