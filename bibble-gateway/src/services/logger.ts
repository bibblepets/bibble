import BaseError from '../errors/base.error';

export class Logger {
  private static getTimestamp() {
    const timestamp = new Date();

    return timestamp.toISOString();
  }

  public static update(...args: string[]) {
    const message = args.map((arg) => JSON.stringify(arg)).join(' ');

    console.log(
      `\x1b[37m%s\x1b[0m`,
      `${this.getTimestamp()} UPDATE: ${message}`
    );
  }

  public static success(...args: string[]) {
    const message = args.map((arg) => JSON.stringify(arg)).join(' ');

    console.log(
      `\x1b[32m%s\x1b[0m`,
      `${this.getTimestamp()} SUCCESS: ${message}`
    );
  }

  public static error(err: BaseError, ...args: string[]) {
    const message = args.map((arg) => JSON.stringify(arg)).join(' ');

    console.error(
      `\x1b[31m%s\x1b[0m`,
      `${this.getTimestamp()} ${err.errorType}: ${err.toString()} ${message}`
    );
  }

  public static debug(...args: string[]) {
    const message = args.map((arg) => JSON.stringify(arg)).join(' ');

    console.log(
      `\x1b[93m%s\x1b[0m`,
      `${this.getTimestamp()} DEBUG: ${message}`
    );
  }

  public static fail(err: Error) {
    console.error(
      `\x1b[31m%s\x1b[0m`,
      `${this.getTimestamp()} ERROR: ${err.message}`
    );
  }
}
