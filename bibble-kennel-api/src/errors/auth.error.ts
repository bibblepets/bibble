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
