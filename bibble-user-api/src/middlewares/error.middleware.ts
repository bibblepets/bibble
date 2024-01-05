import { NextFunction, Request, Response } from 'express';
import { Logger } from '../loggers/logger';
import { UniqueKeyError } from '../errors/database.error';
import { JWTError } from '../errors/jwt.error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof UniqueKeyError) {
    Logger.error(err, err.key);
    res.status(409).send(`${err.name} : ${err.message} ${err.key}`);
  } else if (err instanceof JWTError) {
    Logger.error(err);
    res.status(500).send(`${err.name} : ${err.message}`);
  } else {
    Logger.error(err);
    res.status(500).send(`UNKNOWN_SERVER_ERROR : ${err.message}`);
  }
};
