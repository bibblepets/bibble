import { Request, Response } from 'express';

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

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join('\n') });
  }

  throw error;
};

module.exports = handleError;