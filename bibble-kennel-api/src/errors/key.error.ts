import BaseError from './base.error';

abstract class KeyError extends BaseError {
  constructor(message: string, private property: string, private key: string) {
    super(message);

    Object.setPrototypeOf(this, KeyError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, property: this.property, key: this.key }];
  }

  toString() {
    return `${this.message}, ${this.key}`;
  }
}

export class UniqueKeyError extends KeyError {
  errorCode = 409;
  errorType = 'UNIQUE_KEY_ERROR';

  constructor(message: string, property: string, key: string) {
    super(message, property, key);

    Object.setPrototypeOf(this, UniqueKeyError.prototype);
  }
}

export class KeyNotFoundError extends KeyError {
  errorCode = 404;
  errorType = 'KEY_NOT_FOUND_ERROR';

  constructor(message: string, property: string, key: string) {
    super(message, property, key);

    Object.setPrototypeOf(this, KeyNotFoundError.prototype);
  }
}
