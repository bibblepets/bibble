import { NextFunction, Request, Response } from 'express';
import { Logger } from '../services/logger';
import BaseError from '../errors/base.error';
import mongoose from 'mongoose';
import { ValidationError } from '../errors/validation.error';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof BaseError) {
    Logger.error(err);

    return res
      .status(err.errorCode)
      .send({ errorType: err.errorType, errors: err.serializeErrors() });
  } else if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.entries(err.errors).map(([k, v]) => ({
      message: v.message,
      property: k,
      item: v.value
    }));

    const validationError = new ValidationError(errors);
    Logger.error(validationError);

    return res
      .status(validationError.errorCode)
      .send({ errors: validationError.serializeErrors() });
  }

  res.send({ errors: [{ message: 'Something went wrong.' }] });
};
