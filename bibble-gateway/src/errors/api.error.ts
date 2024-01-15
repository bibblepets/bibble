import BaseError from './base.error';

abstract class APIError extends BaseError {
  errorCode: number;
  errorType: string;
  source: string;
  errors: any;

  constructor(
    errorCode: number,
    errorType: string,
    source: string,
    errors: any
  ) {
    super(`Error from ${source}`);

    this.errorCode = errorCode;
    this.errorType = errorType;
    this.source = source;
    this.errors = errors;

    Object.setPrototypeOf(this, APIError.prototype);
  }

  serializeErrors(): { source: string; errors: any } {
    return { source: this.source, errors: this.errors };
  }

  toString(): string {
    return `${this.source}: ${this.errors}`;
  }
}

export class UserAPIError extends APIError {
  constructor(errorCode: number, errorType: string, errors: any) {
    super(errorCode, errorType, 'bibble-user-api', errors);

    Object.setPrototypeOf(this, UserAPIError.prototype);
  }
}

export class KennelAPIError extends APIError {
  constructor(errorCode: number, errorType: string, errors: any) {
    super(errorCode, errorType, 'bibble-kennel-api', errors);

    Object.setPrototypeOf(this, KennelAPIError.prototype);
  }
}
