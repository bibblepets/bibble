import { Router } from 'express';
import multer from 'multer';
import * as AuthMiddleware from '../middleware/auth.middleware';
import * as UserController from '../controllers/user.controller';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route POST /user/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', UserController.registerUser);

/**
 * @route POST /user/login
 * @desc Login an existing user
 * @access Public
 */
router.post('/login', UserController.loginUser);

/**
 * @route POST /user/logout
 * @desc Logout an existing user
 * @access Public
 */
router.post('/logout', UserController.logoutUser);

/**
 * @route GET /user/auth
 * @desc Authenticate user
 * @access Private
 */
router.get(
  '/auth',
  AuthMiddleware.authHandler,
  UserController.authenticateUser
);

/**
 * @route GET /user/{_id|email}
 * @desc Get user profile
 * @access Private
 */
router.get('/', AuthMiddleware.authHandler, UserController.getUser);

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
  UserController.updateUserProfilePicture
);

module.exports = router;
