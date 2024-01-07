export class BibbleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BibbleError';
  }
}

export class FieldAssertionError extends BibbleError {
  constructor(message: string) {
    super(message);
    this.name = 'BibbleFieldAssertionError';
  }
}
