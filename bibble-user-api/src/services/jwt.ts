import jwt from 'jsonwebtoken';
import {
  ILogoutUserResponse,
  IUser,
  IUserResponse
} from '../interfaces/user.interface';
import { Schema } from 'mongoose';
import { ServerError } from '../errors/server.error';
import { TypedRequest } from '../interfaces/request.interface';
import { TypedResponse } from '../interfaces/response.interface';

const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7
};

export function signAuthToken(
  req: TypedRequest<IUser>,
  res: TypedResponse<IUserResponse>,
  id: Schema.Types.ObjectId
) {
  if (!SECRET_JWT_CODE) {
    throw new ServerError('SECRET_JWT_CODE not found');
  }

  const { email } = req.body;
  const token = jwt.sign({ id, email }, SECRET_JWT_CODE);

  req.params.userId = id.toString();
  res.cookie('authToken', token, COOKIE_OPTIONS);
}

export function verifyAuthToken(authToken: string) {
  if (!SECRET_JWT_CODE) {
    throw new ServerError('SECRET_JWT_CODE not found');
  }

  const decodedToken = jwt.verify(authToken, SECRET_JWT_CODE);

  if (typeof decodedToken === 'string') {
    throw new ServerError('Decoded JWT became a string');
  }

  return decodedToken;
}

export function deleteAuthToken(res: ILogoutUserResponse) {
  res.clearCookie('authToken', COOKIE_OPTIONS);
}
