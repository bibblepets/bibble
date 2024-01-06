import { Router } from 'express';
import * as UserController from '../controllers/user.controller';

const router = Router();

/**
 * @route GET /user/{id|email}
 * @desc Get user profile
 * @access Public
 */
router.get('/', UserController.getUser);

module.exports = router;
