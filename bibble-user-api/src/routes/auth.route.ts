import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';

const router = Router();

/**
 * @route GET /auth/:userId
 * @desc Authenticate a user
 * @access Public
 */
router.get('/:userId', AuthController.authenticate);

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', AuthController.registerUser);

/**
 * @route POST /auth/login
 * @desc Login an existing user
 * @access Public
 */
router.post('/login', AuthController.loginUser);

export default router;
