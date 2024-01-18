import { Router } from 'express';
import multer from 'multer';
import * as KennelController from '../controllers/kennel.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route GET /kennel/species
 * @desc Get all species or species by query
 * @access Public
 */
router.get('/species', KennelController.getSpecies);

/**
 * @route GET /kennel/breed
 * @desc Get all breeds or breeds by query
 * @access Public
 */
router.get('/breed', KennelController.getBreeds);

/**
 * @route GET /kennel/country
 * @desc Get all countries or countries by query
 * @access Public
 */
router.get('/country', KennelController.getCountries);

/**
 * @route GET /kennel/hair-coat
 * @desc Get all hair coats or hair coats by query
 * @access Public
 */
router.get('/hair-coat', KennelController.getHairCoats);

/**
 * @route GET /kennel/legal-tag
 * @desc Get all legal tags or legal tags by query
 * @access Public
 */
router.get('/legal-tag', KennelController.getLegalTags);

/**
 * @route GET /kennel/vaccine
 * @desc Get all vaccines or vaccines by query
 * @access Public
 */
router.get('/vaccine', KennelController.getVaccines);

/**
 * @route GET /kennel/listing
 * @desc Get all listings or listings by query
 * @access Public
 */
router.get('/listing', KennelController.getListings);

/**
 * @route GET /kennel/listing/me
 * @desc Get all listings
 * @access Private
 */
router.get(
  '/listing/me',
  AuthMiddleware.authHandler,
  KennelController.getMyListings
);

/**
 * @route GET /kennel/listing/:_id
 * @desc Get listing by id
 * @access Public
 */
router.get('/listing/:_id', KennelController.getListingById);

/**
 * @route PUT /kennel/listing/:_id
 * @desc Update a listing
 * @access Private
 */
router.put(
  '/listing/:_id',
  AuthMiddleware.authHandler,
  KennelController.updateListing
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
  KennelController.updateListingMedia
);

/**
 * @route POST /kennel/listing-creator
 * @desc Create a listing creator
 * @access Private
 */
router.post(
  '/listing-creator/',
  AuthMiddleware.authHandler,
  KennelController.createListingCreator
);

/**
 * @route POST /kennel/listing-creator/:_id
 * @desc Create a listing
 * @access Private
 */
router.post(
  '/listing-creator/:_id',
  AuthMiddleware.authHandler,
  KennelController.createListing
);

/**
 * @route GET /kennel/listing-creator/me
 * @desc Get my listing creators
 * @access Private
 */
router.get(
  '/listing-creator/me',
  AuthMiddleware.authHandler,
  KennelController.getMyListingCreators
);

/**
 * @route GET /kennel/listing-creator/:_id
 * @desc Get listing creators by id
 * @access Private
 */
router.get(
  '/listing-creator/:_id',
  AuthMiddleware.authHandler,
  KennelController.getListingCreatorById
);

/**
 * @route PUT /kennel/listing-creator/:_id
 * @desc Update a listing creator
 * @access Private
 */
router.put(
  '/listing-creator/:_id',
  AuthMiddleware.authHandler,
  KennelController.updateListingCreator
);

/**
 * @route PUT /kennel/listing-creator/biology/:_id
 * @desc Update a listing creator's biology info
 * @access Private
 */
router.put(
  '/listing-creator/biology/:_id',
  AuthMiddleware.authHandler,
  KennelController.updateBiologyCreator
);

/**
 * @route PUT /kennel/listing-creator/biography/:_id
 * @desc Update a listing creator's biography info
 * @access Private
 */
router.put(
  '/listing-creator/biography/:_id',
  AuthMiddleware.authHandler,
  KennelController.updateBiographyCreator
);

/**
 * @route PUT /kennel/listing-creator/medical/:_id
 * @desc Update a listing creator's medical info
 * @access Private
 */
router.put(
  '/listing-creator/medical/:_id',
  AuthMiddleware.authHandler,
  KennelController.updateMedicalCreator
);

/**
 * @route PUT /kennel/listing-creator/legal/:_id
 * @desc Update a listing creator's legal info
 * @access Private
 */
router.put(
  '/listing-creator/legal/:_id',
  AuthMiddleware.authHandler,
  KennelController.updateLegalCreator
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
  KennelController.updateMediaCreator
);

/**
 * @route PUT /kennel/listing-creator/price/:_id
 * @desc Update a listing creator's price
 * @access Private
 */
router.put(
  '/listing-creator/price/:_id',
  AuthMiddleware.authHandler,
  KennelController.updatePriceCreator
);

/**
 * @route DELETE /kennel/listing-creator/:_id
 * @desc Delete a listing creator
 * @access Private
 */
router.delete(
  '/listing-creator/:_id',
  AuthMiddleware.authHandler,
  KennelController.deleteListingCreatorById
);

export default router;
