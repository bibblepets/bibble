import BaseError from './base.error';

export class PasswordError extends BaseError {
  errorCode = 401;
  errorType = 'PASSWORD_ERROR';

  constructor() {
    super('Incorrect password');

    Object.setPrototypeOf(this, PasswordError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, property: 'password' }];
  }

  toString(): string {
    return `${this.message}`;
  }
}
