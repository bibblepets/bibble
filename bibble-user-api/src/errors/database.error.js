"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueKeyError = exports.DatabaseError = void 0;
class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DATABASE_ERROR';
    }
}
exports.DatabaseError = DatabaseError;
class UniqueKeyError extends DatabaseError {
    constructor(message, key) {
        super(message);
        this.name = 'UNIQUE_KEY_ERROR';
        this.key = key;
    }
}
exports.UniqueKeyError = UniqueKeyError;
