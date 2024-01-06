import BaseError from './base.error';

type ValidationErrorItem = {
  message: string;
  property: string;
  item: string;
};

export class ValidationError extends BaseError {
  errorCode = 400;
  errorType = 'VALIDATION_ERROR';
  errors: ValidationErrorItem[];

  constructor(error: ValidationErrorItem | ValidationErrorItem[]) {
    super('Validation error');

    this.errors = Array.isArray(error) ? error : [error];

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(({ message, property, item }) => ({
      message,
      property,
      item
    }));
  }

  toString() {
    return this.errors
      .map(({ message, property, item }) => `${message}, ${property}, ${item}`)
      .join('; ');
  }
}
