import { Router } from 'express';
import * as HairCoatController from '../controllers/hair-coat.controller';

const router = Router();

/**
 * @route GET /hair-coat
 * @desc Get all hair coats or hair coats by query
 * @access Public
 */
router.get('/', HairCoatController.getHairCoats);

module.exports = router;
