import { Types } from 'mongoose';
import { ValidationError } from '../errors/validation.error';

export function validateObjectId(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new ValidationError({
      message: 'Invalid id',
      property: 'id',
      item: id
    });
  }
}
