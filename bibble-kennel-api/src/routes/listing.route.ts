import { Router } from 'express';
import multer from 'multer';
import * as ListingController from '../controllers/listing.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route POST /kennel/listings
 * @desc Create a new listing
 * @access Private
 */
router.post(
  '/',
  AuthMiddleware.checkAuth,
  AuthMiddleware.validateBibbleTier,
  ListingController.createListing
);

/**
 * @route GET /kennel/listings
 * @desc Get all listings
 * @access Public
 */
router.get('/self', AuthMiddleware.checkAuth, ListingController.getMyListings);

/**
 * @route GET /kennel/listings/species/:species
 * @desc Get all listings for a specific species
 * @access Public
 */
router.get('/species/:species', ListingController.getAllListingsBySpecies);

/**
 * @route GET /kennel/listings/:id
 * @desc Get a listing by ID
 * @access Public
 */
router.get('/:id', ListingController.getListingById);

/**
 * @route GET /kennel/listings
 * @desc Get all listings
 * @access Public
 */
router.get('/', ListingController.getAllListings);

/**
 * @route PUT /kennel/listings/update/:id
 * @desc Update a listing by ID
 * @access Private
 */
router.put(
  '/update/:id',
  AuthMiddleware.checkAuth,
  AuthMiddleware.validateBibbleTier,
  ListingController.updateListingById
);

/**
 * @route PUT /kennel/listings/update-media/:id
 * @desc Update a listing's media by ID
 * @access Private
 */
router.put(
  '/update-media/:id',
  upload.array('data'),
  AuthMiddleware.checkAuth,
  AuthMiddleware.validateBibbleTier,
  ListingController.updateListingMediaById
);

/**
 * @route DELETE /kennel/listings/:id
 * @desc Delete a listing by ID
 * @access Private
 */
router.delete(
  '/:id',
  AuthMiddleware.checkAuth,
  AuthMiddleware.validateBibbleTier,
  ListingController.deleteListingById
);

module.exports = router;
