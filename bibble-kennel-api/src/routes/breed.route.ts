import { Router } from 'express';
import * as BreedController from '../controllers/breed.controller';

const router = Router();

/**
 * @route GET /breed
 * @desc Get all breeds or breeds by query
 * @access Public
 */
router.get('/', BreedController.getBreeds);

export default router;
