import { Router } from 'express';
import multer from 'multer';
import * as AuthMiddleware from '../middleware/auth.middleware';
import * as GatewayService from '../services/gateway';
import { appendData, appendDataForEach } from '../utils/combiners';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route GET /kennel/species
 * @desc Get all species or species by query
 * @access Public
 */
router.get(
  '/species',
  GatewayService.forwardRequest('get', 'kennel', '/species', true),
  GatewayService.returnResponse()
);

/**
 * @route GET /kennel/breed
 * @desc Get all breeds or breeds by query
 * @access Public
 */
router.get(
  '/breed',
  GatewayService.forwardRequest('get', 'kennel', '/breed', true),
  GatewayService.returnResponse()
);

/**
 * @route GET /kennel/country
 * @desc Get all countries or countries by query
 * @access Public
 */
router.get(
  '/country',
  GatewayService.forwardRequest('get', 'kennel', '/country', true),
  GatewayService.returnResponse()
);

/**
 * @route GET /kennel/hair-coat
 * @desc Get all hair coats or hair coats by query
 * @access Public
 */
router.get(
  '/hair-coat',
  GatewayService.forwardRequest('get', 'kennel', '/hair-coat', true),
  GatewayService.returnResponse()
);

/**
 * @route GET /kennel/legal-tag
 * @desc Get all legal tags or legal tags by query
 * @access Public
 */
router.get(
  '/legal-tag',
  GatewayService.forwardRequest('get', 'kennel', '/legal-tag', true),
  GatewayService.returnResponse()
);

/**
 * @route GET /kennel/vaccine
 * @desc Get all vaccines or vaccines by query
 * @access Public
 */
router.get(
  '/vaccine',
  GatewayService.forwardRequest('get', 'kennel', '/vaccine', true),
  GatewayService.returnResponse()
);

/**
 * @route GET /kennel/listing
 * @desc Get all listings or listings by query
 * @access Public
 */
router.get(
  '/listing',
  GatewayService.forwardRequest('get', 'kennel', '/listing', true),
  GatewayService.forwardRequest(
    'post',
    'user',
    '/user/append-users',
    true,
    appendDataForEach
  ),
  GatewayService.returnResponse()
);

/**
 * @route GET /kennel/listing/me
 * @desc Get all listings
 * @access Private
 */
router.get(
  '/listing/me',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('get', 'kennel', '/listing/me/:userId', true),
  GatewayService.forwardRequest(
    'post',
    'user',
    '/user/append-users',
    true,
    appendDataForEach
  ),
  GatewayService.returnResponse()
);

/**
 * @route GET /kennel/listing/:_id
 * @desc Get listing by id
 * @access Public
 */
router.get(
  '/listing/:_id',
  GatewayService.forwardRequest('get', 'kennel', '/listing/:_id'),
  GatewayService.forwardRequest(
    'post',
    'user',
    '/user/append-users',
    false,
    appendData
  ),
  GatewayService.returnResponse()
);

/**
 * @route PUT /kennel/listing/:_id
 * @desc Update a listing
 * @access Private
 */
router.put(
  '/listing/:_id',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('put', 'kennel', '/listing/:_id'),
  GatewayService.forwardRequest(
    'post',
    'user',
    '/user/append-users',
    false,
    appendData
  ),
  GatewayService.returnResponse()
);

/**
 * @route PUT /kennel/listing/media/:_id
 * @desc Update a listing's media
 * @access Private
 */
router.put(
  '/listing/media/:_id',
  upload.array('data'),
  AuthMiddleware.authHandler,
  GatewayService.forwardFileRequest('kennel', '/listing/media/:_id', true),
  GatewayService.forwardRequest(
    'post',
    'user',
    '/user/append-users',
    false,
    appendData
  ),
  GatewayService.returnResponse()
);

/**
 * @route POST /kennel/listing-creator
 * @desc Create a listing creator
 * @access Private
 */
router.post(
  '/listing-creator/',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('post', 'kennel', '/listing-creator/:userId'),
  GatewayService.returnResponse()
);

/**
 * @route POST /kennel/listing-creator/:_id
 * @desc Create a listing
 * @access Private
 */
router.post(
  '/listing-creator/:_id',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest(
    'post',
    'kennel',
    '/listing-creator/create/:_id'
  ),
  GatewayService.returnResponse()
);

/**
 * @route GET /kennel/listing-creator/me
 * @desc Get my listing creators
 * @access Private
 */
router.get(
  '/listing-creator/me',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('get', 'kennel', '/listing-creator/me/:userId'),
  GatewayService.returnResponse()
);

/**
 * @route GET /kennel/listing-creator/:_id
 * @desc Get listing creators by id
 * @access Private
 */
router.get(
  '/listing-creator/:_id',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('get', 'kennel', '/listing-creator/:_id'),
  GatewayService.returnResponse()
);

/**
 * @route PUT /kennel/listing-creator/:_id
 * @desc Update a listing creator
 * @access Private
 */
router.put(
  '/listing-creator/:_id',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('put', 'kennel', '/listing-creator/:_id'),
  GatewayService.returnResponse()
);

/**
 * @route PUT /kennel/listing-creator/biology/:_id
 * @desc Update a listing creator's biology info
 * @access Private
 */
router.put(
  '/listing-creator/biology/:_id',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest(
    'put',
    'kennel',
    '/listing-creator/biology/:_id'
  ),
  GatewayService.returnResponse()
);

/**
 * @route PUT /kennel/listing-creator/biography/:_id
 * @desc Update a listing creator's biography info
 * @access Private
 */
router.put(
  '/listing-creator/biography/:_id',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest(
    'put',
    'kennel',
    '/listing-creator/biography/:_id'
  ),
  GatewayService.returnResponse()
);

/**
 * @route PUT /kennel/listing-creator/medical/:_id
 * @desc Update a listing creator's medical info
 * @access Private
 */
router.put(
  '/listing-creator/medical/:_id',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest(
    'put',
    'kennel',
    '/listing-creator/medical/:_id'
  ),
  GatewayService.returnResponse()
);

/**
 * @route PUT /kennel/listing-creator/legal/:_id
 * @desc Update a listing creator's legal info
 * @access Private
 */
router.put(
  '/listing-creator/legal/:_id',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('put', 'kennel', '/listing-creator/legal/:_id'),
  GatewayService.returnResponse()
);

/**
 * @route PUT /kennel/listing-creator/media/:_id
 * @desc Update a listing creator's media
 * @access Private
 */
router.put(
  '/listing-creator/media/:_id',
  upload.array('data'),
  AuthMiddleware.authHandler,
  GatewayService.forwardFileRequest(
    'kennel',
    '/listing-creator/media/:_id',
    true
  ),
  GatewayService.returnResponse()
);

/**
 * @route PUT /kennel/listing-creator/price/:_id
 * @desc Update a listing creator's price
 * @access Private
 */
router.put(
  '/listing-creator/price/:_id',
  GatewayService.forwardRequest('put', 'kennel', '/listing-creator/price/:_id'),
  GatewayService.returnResponse()
);

/**
 * @route DELETE /kennel/listing-creator/:_id
 * @desc Delete a listing creator
 * @access Private
 */
router.delete(
  '/listing-creator/:_id',
  AuthMiddleware.authHandler,
  GatewayService.forwardRequest('delete', 'kennel', '/listing-creator/:_id'),
  GatewayService.returnResponse()
);

export default router;
