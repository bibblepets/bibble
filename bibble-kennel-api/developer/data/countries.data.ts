import axios from 'axios';
import { Logger } from '../../src/services/logger';
import { ICountryModel } from '../../src/models/country.model';

const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/all?fields=';

const Country: ICountryModel = require('../../src/models/country.model');

export const initCountries = async () => {
  Logger.update('Initializing countries');
  const fields = ['name'];

  try {
    Logger.update('Fetching countries');
    const response = await axios.get(`${REST_COUNTRIES_URL}${fields}`);
    const countries = response.data;
    Logger.success('Fetching countries success');

    Logger.update('Dumping countries');
    const dump = countries.map((country: any) => ({
      name: country.name.common
    }));
    await Country.create(dump);
    Logger.success('Dumping countries success');

    Logger.success('Initializing countries success');
  } catch (error: any) {
    throw new Error(error);
  }
};
