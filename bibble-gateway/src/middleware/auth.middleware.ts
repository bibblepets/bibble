import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import * as jwt from '../services/jwt';
import { UserAPIError } from '../errors/api.error';
import { GatewayError } from '../errors/gateway.error';
import { USER_API_URL } from '../resources/servers';

export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken = req.cookies.authToken;

  try {
    if (!authToken) {
      throw new GatewayError("Auth token doesn't exist");
    }

    const decodedToken = jwt.verifyAuthToken(authToken);

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
  } catch (error: any) {
    next(error);
  }
};
