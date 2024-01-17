import { Router } from 'express';
import * as CountryController from '../controllers/country.controller';

const router = Router();

/**
 * @route GET /country
 * @desc Get all country or country by query
 * @access Public
 */
router.get('/', CountryController.getCountries);

export default router;
