import { Router } from 'express';
import * as VaccineController from '../controllers/vaccine.controller';

const router = Router();

/**
 * @route GET /vaccine
 * @desc Get all vaccines or vaccines by query
 * @access Public
 */
router.get('/', VaccineController.getVaccines);

export default router;
