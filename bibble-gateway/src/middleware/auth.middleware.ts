import axios from 'axios';
import { NextFunction } from 'express';
import { UserAPIError } from '../errors/api.error';
import { GatewayError } from '../errors/gateway.error';
import {
  IBusinessAuthorizedRequest,
  IUserAuthorizedRequest
} from '../interfaces/auth.interface';
import { TypedResponse } from '../interfaces/response.interface';
import * as jwt from '../services/jwt';

export const authHandler = async (
  req: IUserAuthorizedRequest,
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
  req: IUserAuthorizedRequest,
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
  _req: IUserAuthorizedRequest,
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

export const businessAuthHandler = async (
  req: IBusinessAuthorizedRequest,
  res: TypedResponse,
  next: NextFunction
) => {
  try {
    const businessAuthToken = req.cookies.businessAuthToken;
    const { USER_API_URL } = req.app.locals;

    if (!businessAuthToken) {
      throw new GatewayError("Business auth token doesn't exist");
    }

    const decodedToken = jwt.verifyBusinessAuthToken(req, businessAuthToken);

    const response = await axios
      .get(`${USER_API_URL}/auth/business/${decodedToken.id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new UserAPIError(error.response);
      });

    const businessId = response.data._id;

    jwt.signBusinessAuthToken(req, res, businessId);

    req.params.businessId = businessId;
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const setBusinessAuthTokenHandler = (
  req: IBusinessAuthorizedRequest,
  res: TypedResponse,
  next: NextFunction
) => {
  try {
    const businessId = req.payload?._id;

    if (!businessId) {
      throw new GatewayError('Business ID not found');
    }

    jwt.signBusinessAuthToken(req, res, businessId);

    req.params.businessId = businessId.toString();
    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteBusinessAuthTokenHandler = (
  _req: IBusinessAuthorizedRequest,
  res: TypedResponse,
  next: NextFunction
) => {
  try {
    jwt.deleteBusinessAuthToken(res);

    next();
  } catch (error: unknown) {
    next(error);
  }
};
