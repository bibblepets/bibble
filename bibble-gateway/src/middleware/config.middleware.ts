import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

export const configHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const KENNEL_API_URL = process.env.BIBBLE_KENNEL_API_URL;
    const USER_API_URL = process.env.BIBBLE_USER_API_URL;
    const SECRET_JWT_CODE = process.env.SECRET_JWT_CODE;

    req.app.locals = { KENNEL_API_URL, USER_API_URL, SECRET_JWT_CODE };
    next();
  } catch (error: unknown) {
    next(error);
  }
};
