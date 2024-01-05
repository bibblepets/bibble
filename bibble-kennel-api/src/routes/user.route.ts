import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route GET /kennel/user
 * @desc Get user profile
 * @access Private
 */
router.get('/', AuthMiddleware.checkAuth, UserController.getUser);

/**
 * @route PUT /kennel/user
 * @desc Update user profile
 * @access Private
 */
router.put('/', AuthMiddleware.checkAuth, UserController.updateUser);

/**
 * @route PUT /kennel/user/profile-picture
 * @desc Update user profile picture
 * @access Private
 */
router.put(
  '/profile-picture',
  upload.single('data'),
  AuthMiddleware.checkAuth,
  UserController.updateProfilePicture
);

module.exports = router;
