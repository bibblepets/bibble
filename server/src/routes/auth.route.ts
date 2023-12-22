import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';

const router = Router();

/**
 * @route GET /api/auth/status
 * @desc Check if user is logged in
 * @access Public
 */
router.get('/status', AuthController.checkAuthStatus);

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', AuthController.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login an existing user
 * @access Public
 */
router.post('/login', AuthController.loginUser);

/**
 * @route POST /api/auth/logout
 * @desc Logout an existing user
 * @access Private
 */
router.post('/logout', AuthController.logoutUser);

module.exports = router;
