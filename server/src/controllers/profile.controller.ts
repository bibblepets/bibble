import { Request, Response } from 'express';
import { IBuyerProfile } from '../models/user/buyerProfile.model';

const { handleError } = require('../utils/util');

const BuyerProfile = require('../models/user/buyerProfile.model');

const createProfile = async (req: Request, res: Response) => {
    try {
        const buyerProfile = await createBuyerProfile(req, res);
        return res.status(201).json(buyerProfile);
    } catch (error) {
        return handleError(req, res, error);
    }
};

const createBuyerProfile = async (req: Request, res: Response) => {
    const buyerProfile: IBuyerProfile = req.body;
    return await BuyerProfile.create(buyerProfile);
};

module.exports = {
    createProfile
};