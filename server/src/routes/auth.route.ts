import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';

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

/**
 * @route PUT /api/auth/update/:id
 * @desc Update an existing user
 * @access Private
 */
router.put('/update/:id', AuthMiddleware.getUserFromAuthToken, AuthController.updateUser);

module.exports = router;
