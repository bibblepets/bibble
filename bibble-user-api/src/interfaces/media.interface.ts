import { Request, Response } from 'express';

export interface IMedia {
  _id: string;
  name: string;
}

export interface IMediaRequest extends Request {
  body: IMedia & { url?: string };
}

export interface IMediaResponse extends Response {
  media: IMedia & { url: string };
}
