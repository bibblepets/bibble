import { Response } from 'express';
import { Send } from 'express-serve-static-core';

export interface TypedResponse<T> extends Response {
  json: Send<T, this>;
}
