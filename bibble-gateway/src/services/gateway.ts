import axios from 'axios';
import { NextFunction } from 'express';
import { GatewayError } from '../errors/gateway.error';
import {
  IForwardFileRequest,
  IForwardRequest
} from '../interfaces/forward.interface';
import { TypedResponse } from '../interfaces/response.interface';
import { Logger } from './logger';

export const forwardRequest =
  (method: string, domain: string, route: string, isMultiple?: boolean) =>
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

      const { params, query, body } = req;
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
        data: body
      })
        .then((response) => {
          return response;
        })
        .catch((error) => {
          throw new GatewayError(error.response);
        });

      Logger.success(`Forwarded ${method} request to ${url} successfully`);

      req.payload = isMultiple ? [] : {};
      req.payload = isMultiple
        ? [...(req.payload as object[]), ...response.data]
        : { ...(req.payload as object), ...response.data };

      next();
    } catch (error: unknown) {
      next(error);
    }
  };

export const forwardFileRequest =
  (domain: string, route: string) =>
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

      const { media } = req.body;
      const file = req.file as Express.Multer.File;
      const blob = new Blob([file.buffer], { type: file.mimetype });

      const formData = new FormData();
      formData.append('media', media);
      formData.append('data', blob, file.originalname);

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
