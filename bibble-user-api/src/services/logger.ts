import BaseError from '../errors/base.error';

export class Logger {
  private static getTimestamp() {
    const timestamp = new Date();

    return timestamp.toISOString();
  }

  public static update(...args: any[]) {
    const message = args.map((arg) => JSON.stringify(arg)).join(' ');

    console.log(
      `\x1b[37m%s\x1b[0m`,
      `${this.getTimestamp()} UPDATE: ${message}`
    );
  }

  public static success(...args: any[]) {
    const message = args.map((arg) => JSON.stringify(arg)).join(' ');

    console.log(
      `\x1b[32m%s\x1b[0m`,
      `${this.getTimestamp()} SUCCESS: ${message}`
    );
  }

  public static error(err: BaseError, ...args: any[]) {
    const message = args.map((arg) => JSON.stringify(arg)).join(' ');

    console.error(
      `\x1b[31m%s\x1b[0m`,
      `${this.getTimestamp()} ${err.errorType}: ${err.toString()}`
    );
  }

  public static debug(...args: any[]) {
    const message = args.map((arg) => JSON.stringify(arg)).join(' ');

    console.log(
      `\x1b[93m%s\x1b[0m`,
      `${this.getTimestamp()} DEBUG: ${message}`
    );
  }
}
