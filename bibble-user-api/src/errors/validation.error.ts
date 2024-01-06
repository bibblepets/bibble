import BaseError from './base.error';

export class ValidationError extends BaseError {
  errorCode = 400;
  errorType = 'VALIDATION_ERROR';

  constructor(message: string, private property: string, private item: string) {
    super(message);

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors() {
    return [
      { message: this.message, property: this.property, item: this.item }
    ];
  }

  toString() {
    return `${this.message}, ${this.property}, ${this.item}`;
  }
}
