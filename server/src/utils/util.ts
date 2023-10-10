import { Response } from 'express';
import { Error } from 'mongoose';

export const handleError = async (res: Response, error: any) => {
  const errors = [];

  if (error instanceof Error.ValidationError) {
    Object.keys(error.errors)
      .map((key: string) => error.errors[key].message)
      .forEach((message: string) => errors.push(message));
  }

  if (error instanceof Error.CastError) {
    errors.push(error.message);
    return res.status(400).json({ message: error.message });
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

export const mapSpeciesToFunction = (
  species: string,
  funcArr: Function[]
): Function | null => {
  if (species === 'Dog') {
    return funcArr[0];
  }
  return null;
};
