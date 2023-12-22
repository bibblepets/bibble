import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';

const router = Router();

/**
 * @route PUT /api/user
 * @desc Update user profile
 * @access Private
 */
router.put('/', AuthMiddleware.checkAuth, UserController.updateUser);