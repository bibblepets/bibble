import { Router } from 'express';
import multer from 'multer';
import * as AuthMiddleware from '../middleware/auth.middleware';
import * as UserController from '../controllers/user.controller';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route GET /user/{id|email}
 * @desc Get user profile
 * @access Public
 */
router.get('/', UserController.getUser);

/**
 * @route PUT /user
 * @desc Update user profile
 * @access Private
 */
router.put('/', AuthMiddleware.authHandler, UserController.updateUser);

/**
 * @route PUT /user/profile-picture
 * @desc Update user profile picture
 * @access Private
 */
router.put(
  '/profile-picture',
  upload.single('data'),
  AuthMiddleware.authHandler,
  UserController.updateProfilePicture
);

module.exports = router;
