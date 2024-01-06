import BaseError from './base.error';

export class AuthTokenError extends BaseError {
  errorCode = 401;
  errorType = 'AUTH_TOKEN_ERROR';

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, AuthTokenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, property: 'token' }];
  }

  toString(): string {
    return `${this.message}`;
  }
}

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
