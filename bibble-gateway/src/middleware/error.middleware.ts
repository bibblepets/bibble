import { NextFunction, Request, Response } from 'express';
import { Logger } from '../services/logger';
import BaseError from '../errors/base.error';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof BaseError) {
    Logger.error(err);

    return res.status(err.errorCode).send(err.serializeErrors());
  }

  res.send({ errors: [{ message: 'Something went wrong.' }] });
};
