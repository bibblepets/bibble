import { Router } from 'express';
import * as DeveloperController from '../controllers/developer.controller';

const router = Router();

/**
 * @route GET /api/developer/breeds/:species
 * @desc Get all breeds of a given species
 * @access Public
 */
router.get('/breeds/:species', DeveloperController.getBreedsBySpecies);

/**
 * @route GET /api/developer/vaccines/:species
 * @desc Get all vaccines of a given species
 * @access Public
 */
router.get('/vaccines/:species', DeveloperController.getVaccinesBySpecies);

/**
 * @route GET /api/developer/countries
 * @desc Get all countries of origin
 * @access Public
 */
router.get('/countries', DeveloperController.getAllCountriesOfOrigin);

module.exports = router;