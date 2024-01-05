"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static getTimestamp() {
        const timestamp = new Date();
        return timestamp.toISOString();
    }
    static update(...args) {
        const message = args.map((arg) => JSON.stringify(arg)).join(' ');
        console.log(`\x1b[37m%s\x1b[0m`, `${this.getTimestamp()} UPDATE: ${message}`);
    }
    static success(...args) {
        const message = args.map((arg) => JSON.stringify(arg)).join(' ');
        console.log(`\x1b[32m%s\x1b[0m`, `${this.getTimestamp()} SUCCESS: ${message}`);
    }
    static error(err, ...args) {
        const message = args.map((arg) => JSON.stringify(arg)).join(' ');
        const errorType = err.name.toUpperCase();
        console.error(`\x1b[31m%s\x1b[0m`, `${this.getTimestamp()} ${errorType}: ${err.message} ${message}`);
    }
}
exports.Logger = Logger;
