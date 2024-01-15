import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import * as cookie from 'cookie';
import { Logger } from '../services/logger';
import dotenv from 'dotenv';
import { UserAPIError } from '../errors/api.error';

dotenv.config();

const bibbleUserApiUrl = process.env.BIBBLE_USER_API_URL;

export const authHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const authToken = cookies.authToken;

  try {
    Logger.update('Authenticating user');

    const user = await axios
      .get(`${bibbleUserApiUrl}/auth`, {
        headers: {
          Cookie: `authToken=${authToken}`
        }
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const errorCode = error.response.status;
        const { errorType, errors } = error.response.data;

        throw new UserAPIError(errorCode, errorType, errors);
      });

    Logger.success('User authenticated', user._id);

    req.body.userId = user._id;

    next();
  } catch (error: any) {
    next(error);
  }
};
