import { Request, Response } from 'express';
import { ICountry } from '../models/country.model';

const Country = require('../models/country.model');

const createCountry = async (req: Request, res: Response ) => {
  const params: ICountry = req.body;

  await Country.create(params)
    .then((country: ICountry) => {
      console.log('Country created successfully: ' + country);
      return res.json({ country: country })
    })
    .catch((error: Error) => {
      let message = 'Error creating Country:\n' + error.message;
      return res.json({ message: message });
    });
}

const getAllCountries = async (req: Request, res: Response ) => {
  await Country.find()
    .then((countries: ICountry[]) => {
      console.log('Countries retrieved successfully: ' + countries);
      return res.json({ countries: countries})
    })
    .catch((error: Error) => {
      let message = 'Error retrieving Countries:\n' + error.message;
      return res.json({ message: message });
    });
}

module.exports = {
  createCountry,
  getAllCountries
}
