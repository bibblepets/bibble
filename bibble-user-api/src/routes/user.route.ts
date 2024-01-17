import { Router } from 'express';
import multer from 'multer';
import * as UserController from '../controllers/user.controller';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route GET /user/{_id|email}
 * @desc Get user profile
 * @access Public
 */
router.get('/', UserController.getUser);

/**
 * @route PUT /user/:userId
 * @desc Update user profile
 * @access Private
 */
router.put('/:userId', UserController.updateUser);

/**
 * @route PUT /user/profile-picture/:userId
 * @desc Update user profile picture
 * @access Private
 */
router.put(
  '/profile-picture/:userId',
  upload.single('data'),
  UserController.updateUserProfilePicture
);

export default router;
