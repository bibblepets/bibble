import { Request, Response } from 'express';
import { Error, MongooseError } from 'mongoose';

export const handleError = async (res: Response, error: any) => {
  const errors = [];

  if (error instanceof Error.ValidationError) {
    Object.keys(error.errors)
      .map((key: string) => error.errors[key].message)
      .forEach((message: string) => errors.push(message));
  }

  if (error instanceof Error.CastError) {
    errors.push(error.message);
  }

  if (error instanceof MongooseError) {
    errors.push(error.message);
  }

  if (error.code === 11000) {
    errors.push(
      Object.keys(error.keyValue).map(
        (key: string) => `This ${key} already exists.`
      )
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join('\n') });
  }

  console.log('An unexpecter error occurred...');
  console.log(error);
  return res.status(500).json({ message: error.message });
};

export const assertFields = (fields: string[], req: Request) => {
  const missingFields: string[] = fields.filter((field) => {
    const value = req.body[field];
    return (
      !value ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    );
  });

  if (missingFields.length) {
    throw new MongooseError(
      `${
        missingFields[0].charAt(0).toUpperCase() + missingFields[0].slice(1)
      } required`
    );
  }
};
