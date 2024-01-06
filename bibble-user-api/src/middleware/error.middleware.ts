import { NextFunction, Request, Response } from 'express';
import { Logger } from '../loggers/logger';
import BaseError from '../errors/base.error';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof BaseError) {
    Logger.error(err);
    return res.send({ errors: err.serializeErrors() });
  }

  res.send({ errors: [{ message: 'Something went wrong.' }] });
};
