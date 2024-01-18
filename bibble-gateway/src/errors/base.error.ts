abstract class BaseError extends Error {
  abstract errorCode: number;
  abstract errorType: string;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serializeErrors(): { source: string; errors: unknown };

  abstract toString(): string;
}

export default BaseError;
