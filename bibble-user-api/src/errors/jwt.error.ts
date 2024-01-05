export class JWTError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JWT_ERROR';
  }
}
