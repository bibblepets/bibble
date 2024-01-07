import { Router } from 'express';
import * as SpeciesController from '../controllers/species.controller';

const router = Router();

/**
 * @route GET /species
 * @desc Get all species or species by query
 * @access Public
 */
router.get('/', SpeciesController.getSpecies);

module.exports = router;
