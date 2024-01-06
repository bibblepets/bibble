import BaseError from './base.error';

export class ServerError extends BaseError {
  errorCode = 500;
  errorType = 'SERVER_ERROR';

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }

  toString(): string {
    return `${this.message}`;
  }
}
