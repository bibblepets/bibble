import { Router } from 'express';
import multer from 'multer';
import * as AuthMiddleware from '../middleware/auth.middleware';
import * as GatewayService from '../services/gateway';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route POST /user/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  GatewayService.forwardRequest('post', 'user', '/auth/register'),
  AuthMiddleware.setAuthTokenHandler,
  GatewayService.returnResponse(201)
);

/**
 * @route POST /user/login
 * @desc Login an existing user
 * @access Public
 */
router.post(
  '/login',
  GatewayService.forwardRequest('post', 'user', '/auth/login'),
  AuthMiddleware.setAuthTokenHandler,
  GatewayService.returnResponse()
);

/**
 * @route POST /user/logout
 * @desc Logout an existing user
 * @access Public
 */
router.post(
  '/logout',
  AuthMiddleware.deleteAuthTokenHandler,
  GatewayService.returnResponse()
);

/**
 * @route GET /user/auth
 * @desc Authenticate user
 * @access Private
 */
router.get(
  '/auth',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('get', 'user', '/auth/:userId'),
  GatewayService.returnResponse()
);

/**
 * @route GET /user
 * @desc Get user profile
 * @access Private
 */
router.get(
  '/',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('get', 'user', '/user/:userId'),
  GatewayService.returnResponse()
);

/**
 * @route PUT /user
 * @desc Update user profile
 * @access Private
 */
router.put(
  '/',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('put', 'user', '/user/:userId'),
  GatewayService.returnResponse()
);

/**
 * @route PUT /user/profile-picture
 * @desc Update user profile picture
 * @access Private
 */
router.put(
  '/profile-picture',
  upload.single('data'),
  AuthMiddleware.authHandler,
  GatewayService.forwardFileRequest('user', '/user/profile-picture/:userId'),
  GatewayService.returnResponse()
);

/**
 * @route PUT /user/business/auth
 * @desc Authenticate business
 * @access Private
 */
router.get(
  '/business/auth',
  AuthMiddleware.businessAuthHandler,
  GatewayService.forwardRequest('get', 'user', '/auth/business/:businessId'),
  GatewayService.returnResponse()
);

/**
 * @route GET /user/business/register
 * @desc Authenticate business
 * @access Private
 */
router.post(
  '/business/register',
  GatewayService.forwardRequest('post', 'user', '/auth/business/register'),
  AuthMiddleware.setBusinessAuthTokenHandler,
  GatewayService.returnResponse(201)
);

/**
 * @route POST /user/business/login
 * @desc Login an existing business
 * @access Public
 */
router.post(
  '/business/login',
  GatewayService.forwardRequest('post', 'user', '/auth/business/login'),
  AuthMiddleware.setBusinessAuthTokenHandler,
  GatewayService.returnResponse()
);

/**
 * @route POST /user/business/logout
 * @desc Logout an existing business
 * @access Public
 */
router.post(
  '/business/logout',
  AuthMiddleware.deleteBusinessAuthTokenHandler,
  GatewayService.returnResponse()
);

/**
 * @route GET /user/business
 * @desc Get business profile
 * @access Private
 */
router.get(
  '/business',
  AuthMiddleware.businessAuthHandler,
  GatewayService.forwardRequest('get', 'user', '/business/:businessId'),
  GatewayService.returnResponse()
);

/**
 * @route PUT /user/business
 * @desc Update business profile
 * @access Private
 */
router.put(
  '/business',
  AuthMiddleware.businessAuthHandler,
  GatewayService.forwardRequest('put', 'user', '/business/:businessId'),
  GatewayService.returnResponse()
);

/**
 * @route PUT /user/business/media
 * @desc Update business media
 * @access Private
 */
router.put(
  '/business/media',
  upload.array('data'),
  AuthMiddleware.businessAuthHandler,
  GatewayService.forwardFileRequest(
    'user',
    '/business/media/:businessId',
    true
  ),
  GatewayService.returnResponse()
);

export default router;
