import jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';
import { GatewayError } from '../errors/gateway.error';
import {
  IBusinessAuthorizedRequest,
  IUserAuthorizedRequest
} from '../interfaces/auth.interface';
import { TypedResponse } from '../interfaces/response.interface';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 7
};

export function signAuthToken(
  req: IUserAuthorizedRequest,
  res: TypedResponse,
  id: Schema.Types.ObjectId
) {
  const { SECRET_JWT_CODE } = req.app.locals;

  if (!SECRET_JWT_CODE) {
    throw new GatewayError('SECRET_JWT_CODE not found');
  }

  const { email } = req.body;
  const token = jwt.sign({ id, email }, SECRET_JWT_CODE);

  req.params.userId = id.toString();
  res.cookie('authToken', token, COOKIE_OPTIONS);
}

export function verifyAuthToken(
  req: IUserAuthorizedRequest,
  authToken: string
) {
  const { SECRET_JWT_CODE } = req.app.locals;

  if (!SECRET_JWT_CODE) {
    throw new GatewayError('SECRET_JWT_CODE not found');
  }

  const decodedToken = jwt.verify(authToken, SECRET_JWT_CODE);

  if (typeof decodedToken === 'string') {
    throw new GatewayError('Decoded JWT became a string');
  }

  return decodedToken;
}

export function deleteAuthToken(res: TypedResponse) {
  res.clearCookie('authToken', COOKIE_OPTIONS);
}

export function signBusinessAuthToken(
  req: IBusinessAuthorizedRequest,
  res: TypedResponse,
  id: Schema.Types.ObjectId
) {
  const { SECRET_JWT_CODE } = req.app.locals;

  if (!SECRET_JWT_CODE) {
    throw new GatewayError('SECRET_JWT_CODE not found');
  }

  const { email } = req.body;
  const token = jwt.sign({ id, email }, SECRET_JWT_CODE);

  req.params.businessId = id.toString();
  res.cookie('businessAuthToken', token, COOKIE_OPTIONS);
}

export function verifyBusinessAuthToken(
  req: IBusinessAuthorizedRequest,
  businessAuthToken: string
) {
  const { SECRET_JWT_CODE } = req.app.locals;

  if (!SECRET_JWT_CODE) {
    throw new GatewayError('SECRET_JWT_CODE not found');
  }

  const decodedToken = jwt.verify(businessAuthToken, SECRET_JWT_CODE);

  if (typeof decodedToken === 'string') {
    throw new GatewayError('Decoded JWT became a string');
  }

  return decodedToken;
}

export function deleteBusinessAuthToken(res: TypedResponse) {
  res.clearCookie('businessAuthToken', COOKIE_OPTIONS);
}
