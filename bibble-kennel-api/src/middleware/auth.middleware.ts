import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import * as cookie from 'cookie';
import { Logger } from '../services/logger';
import { AuthTokenError } from '../errors/auth.error';
import dotenv from 'dotenv';

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
      .catch((_error) => {
        throw new AuthTokenError('Unauthorized');
      });

    Logger.success('User authenticated', user._id);

    req.body.userId = user._id;

    next();
  } catch (error: any) {
    next(error);
  }
};
