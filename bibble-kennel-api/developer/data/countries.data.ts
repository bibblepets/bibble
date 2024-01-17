import axios from 'axios';
import Country from '../../src/models/country.model';
import { Logger } from '../../src/services/logger';

type CountryType = {
  name: { common: string };
};

const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/all?fields=';

export const initCountries = async () => {
  Logger.update('Initializing countries');
  const fields = ['name'];

  try {
    Logger.update('Fetching countries');
    const response = await axios.get(`${REST_COUNTRIES_URL}${fields}`);
    const countries = response.data;
    Logger.success('Fetching countries success');

    Logger.update('Dumping countries');
    const dump = countries.map((country: CountryType) => ({
      name: country.name.common
    }));
    await Country.create(dump);
    Logger.success('Dumping countries success');

    Logger.success('Initializing countries success');
  } catch (error: unknown) {
    throw new Error(String(error));
  }
};
