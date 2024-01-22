import axios from 'axios';
import { NextFunction } from 'express';
import { GatewayError } from '../errors/gateway.error';
import { ICombinableObject } from '../interfaces/combiner.interface';
import {
  IForwardFileRequest,
  IForwardRequest
} from '../interfaces/forward.interface';
import { TypedResponse } from '../interfaces/response.interface';
import { Logger } from './logger';

export const forwardRequest =
  (
    method: string,
    domain: string,
    route: string,
    isMultiple?: boolean,
    combine?: (
      a: ICombinableObject | ICombinableObject[],
      b: ICombinableObject | ICombinableObject[]
    ) => ICombinableObject | ICombinableObject[]
  ) =>
  async <T extends IForwardRequest, U extends TypedResponse>(
    req: T,
    _res: U,
    next: NextFunction
  ) => {
    try {
      let resource;

      switch (domain) {
        case 'user':
          resource = req.app.locals.USER_API_URL;
          break;
        case 'kennel':
          resource = req.app.locals.KENNEL_API_URL;
          break;
      }

      const { params, query, body, payload } = req;
      let url = `${resource}${route}`;

      Object.keys(params).forEach((key) => {
        url = url.replace(`:${key}`, params[key]);
      });

      Object.keys(query).forEach((key) => {
        url = `${url}?${key}=${query[key]}`;
      });

      Logger.update(`Forwarding ${method} request to ${url}`);

      const response = await axios({
        url,
        method,
        data: payload || body
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          throw new GatewayError(error.response);
        });

      Logger.success(`Forwarded ${method} request to ${url} successfully`);

      req.payload = req.payload || (isMultiple ? [] : {});

      if (combine) {
        req.payload = combine(req.payload, response.data);
      } else {
        req.payload = response.data;
      }

      next();
    } catch (error: unknown) {
      next(error);
    }
  };

export const forwardFileRequest =
  (domain: string, route: string, isMultiple?: boolean) =>
  async (req: IForwardFileRequest, _res: TypedResponse, next: NextFunction) => {
    try {
      let resource;

      switch (domain) {
        case 'user':
          resource = req.app.locals.USER_API_URL;
          break;
        case 'kennel':
          resource = req.app.locals.KENNEL_API_URL;
          break;
      }

      const { params } = req;
      let url = `${resource}${route}`;

      Object.keys(params).forEach((key) => {
        url = url.replace(`:${key}`, params[key]);
      });

      const formData = new FormData();

      if (isMultiple) {
        const media = req.body.media as string[];
        const files = req.files as Express.Multer.File[];
        const blobs = files.map(
          (f) => new Blob([f.buffer], { type: f.mimetype })
        );

        media?.forEach((m) => formData.append('media[]', m));
        blobs.forEach((b) => formData.append('data', b));
      } else {
        const media = req.body.media as string;
        const file = req.file as Express.Multer.File;
        const blob = new Blob([file.buffer], { type: file.mimetype });

        formData.append('media', media);
        formData.append('data', blob, file.originalname);
      }

      Logger.update(`Forwarding file request to ${url}`);

      const response = await axios({
        url,
        method: 'put',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          throw new GatewayError(error.response);
        });

      Logger.success(`Forwarded file request to ${url} successfully`);

      req.payload = response.data;

      next();
    } catch (error: unknown) {
      next(error);
    }
  };

export const returnResponse =
  (status: number = 200) =>
  <T extends IForwardRequest, U extends TypedResponse>(req: T, res: U) => {
    return res.status(status).json(req.payload);
  };
