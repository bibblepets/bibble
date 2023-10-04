import { Request, Response } from 'express';

const validateEmail = (email: string) => {
  return RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+\.?)|(".+"))@(([a-zA-Z\d-]+\.)+[a-zA-Z]{2,})$/
  ).exec(String(email).toLowerCase());
};

const handleError = async (req: Request, res: Response, error: any) => {
  const errors = [];

  if (error.name === 'ValidationError') {
    errors.push(
      Object.keys(error.errors).map((key: string) => error.errors[key].message)
    );
  }

  if (error.name == 'CastError') {
    errors.push(error.message);
    return res.status(400).json({ message: error.message });
  }

  if (error.code === 11000) {
    errors.push(
      Object.keys(error.keyValue).map((key: string) => `${key} already exists.`)
    );
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join('\n') });
  }

  console.log('Unforeseen error: ' + error.message);
  return res.status(500).json({ message: error.message });
};

const mapSpeciesToFunction = (
  species: string,
  funcArr: Function[]
): Function | null => {
  if (species === 'Dog') {
    return funcArr[0];
  }
  return null;
};

module.exports = {
  validateEmail,
  handleError,
  mapSpeciesToFunction
};
