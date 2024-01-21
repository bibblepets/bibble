import axios from 'axios';
import { NextFunction } from 'express';
import { UserAPIError } from '../errors/api.error';
import { GatewayError } from '../errors/gateway.error';
import { IAuthorizedRequest } from '../interfaces/auth.interface';
import { TypedResponse } from '../interfaces/response.interface';
import * as jwt from '../services/jwt';

export const authHandler = async (
  req: IAuthorizedRequest,
  res: TypedResponse,
  next: NextFunction
) => {
  try {
    const authToken = req.cookies.authToken;
    const { USER_API_URL } = req.app.locals;

    if (!authToken) {
      throw new GatewayError("Auth token doesn't exist");
    }

    const decodedToken = jwt.verifyAuthToken(req, authToken);

    const response = await axios
      .get(`${USER_API_URL}/auth/${decodedToken.id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new UserAPIError(error.response);
      });

    const userId = response.data._id;

    jwt.signAuthToken(req, res, userId);

    req.params.userId = userId;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const setAuthTokenHandler = (
  req: IAuthorizedRequest,
  res: TypedResponse,
  next: NextFunction
) => {
  try {
    const userId = req.payload?._id;

    if (!userId) {
      throw new GatewayError('User ID not found');
    }

    jwt.signAuthToken(req, res, userId);

    req.params.userId = userId.toString();
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteAuthTokenHandler = (
  _req: IAuthorizedRequest,
  res: TypedResponse,
  next: NextFunction
) => {
  try {
    jwt.deleteAuthToken(res);

    next();
  } catch (error: unknown) {
    next(error);
  }
};
