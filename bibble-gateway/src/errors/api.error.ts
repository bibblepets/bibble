import BaseError from './base.error';

type APIErrorResponse = {
  status: number;
  data: {
    errorType: string;
    errors: unknown;
  };
};

abstract class APIError extends BaseError {
  errorCode: number;
  errorType: string;
  source: string;
  errors: unknown;

  constructor(
    errorCode: number,
    errorType: string,
    source: string,
    errors: unknown
  ) {
    super(`Error from ${source}`);

    this.errorCode = errorCode;
    this.errorType = errorType;
    this.source = source;
    this.errors = errors;

    Object.setPrototypeOf(this, APIError.prototype);
  }

  serializeErrors(): { source: string; errors: unknown } {
    return { source: this.source, errors: this.errors };
  }

  toString(): string {
    return `${this.source}: ${this.errors}`;
  }
}

export class UserAPIError extends APIError {
  constructor(res: APIErrorResponse) {
    const errorCode = res.status;
    const { errorType, errors } = res.data;

    super(errorCode, errorType, 'bibble-user-api', errors);

    Object.setPrototypeOf(this, UserAPIError.prototype);
  }
}

export class KennelAPIError extends APIError {
  constructor(res: APIErrorResponse) {
    const errorCode = res.status;
    const { errorType, errors } = res.data;

    super(errorCode, errorType, 'bibble-kennel-api', errors);

    Object.setPrototypeOf(this, KennelAPIError.prototype);
  }
}
