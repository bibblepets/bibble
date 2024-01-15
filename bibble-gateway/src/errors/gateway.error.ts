import BaseError from './base.error';

export class GatewayError extends BaseError {
  errorCode = 500;
  errorType = 'GATEWAY_ERROR';

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, GatewayError.prototype);
  }

  serializeErrors(): { source: string; errors: any } {
    return { source: 'bibble-gateway', errors: [{ message: this.message }] };
  }

  toString(): string {
    return `bibble-gateway: ${this.message}`;
  }
}
