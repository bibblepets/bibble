export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DATABASE_ERROR';
  }
}

export class UniqueKeyError extends DatabaseError {
  key: string;

  constructor(message: string, key: string) {
    super(message);
    this.name = 'UNIQUE_KEY_ERROR';
    this.key = key;
  }
}
