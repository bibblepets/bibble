import { NextFunction } from 'express';
import {
  IGetLegalTagsRequest,
  IGetLegalTagsResponse
} from '../interfaces/legal-tag.interface';
import LegalTag from '../models/legal-tag.model';
import { Logger } from '../services/logger';

export const getLegalTags = async (
  req: IGetLegalTagsRequest,
  res: IGetLegalTagsResponse,
  next: NextFunction
) => {
  const query = req.query;

  try {
    Logger.update('Fetching legal tags');

    const legalTags = await LegalTag.find(query);

    Logger.success('Legal tags fetched');

    return res.status(200).json(legalTags);
  } catch (error: unknown) {
    next(error);
  }
};
