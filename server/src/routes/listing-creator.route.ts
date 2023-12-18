import { Router } from 'express';
import * as ListingCreatorController from '../controllers/listing-creator.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';

const router = Router();

/**
 * @route GET /api/listing-creator
 * @desc Get all listing creators
 * @access Private
 */
router.get('/', AuthMiddleware.checkBibbleTier, ListingCreatorController.getAllListingCreators);

/**
 * @route GET /api/listing-creator/:id
 * @desc Get a listing creator by ID
 * @access Private
 */
router.get('/:id', AuthMiddleware.checkBibbleTier, ListingCreatorController.getListingCreatorById);

/**
 * @route POST /api/listing-creator
 * @desc Create a new listing
 * @access Private
 */
router.post('/', AuthMiddleware.checkBibbleTier, ListingCreatorController.createListingCreator);

/**
 * @route POST /api/listing-creator/update
 * @desc Update a listing creator
 * @access Private
 */
router.post('/update', AuthMiddleware.checkBibbleTier, ListingCreatorController.updateListingCreatorById);

/**
 * @route POST /api/listing-creator/biology
 * @desc Update the biology of a listing
 * @access Private
 */
router.post('/biology', AuthMiddleware.checkBibbleTier, ListingCreatorController.updateBiology);

/**
 * @route POST /api/listing-creator/biography
 * @desc Update the biography of a listing
 * @access Private
 */
router.post('/biography', AuthMiddleware.checkBibbleTier, ListingCreatorController.updateBiography);

/**
 * @route POST /api/listing-creator/medical
 * @desc Update the medical of a listing
 * @access Private
 */
router.post('/medical', AuthMiddleware.checkBibbleTier, ListingCreatorController.updateMedical);

/**
 * @route POST /api/listing-creator/legal
 * @desc Update the legal of a listing
 * @access Private
 */
router.post('/legal', AuthMiddleware.checkBibbleTier, ListingCreatorController.updateLegal);

/**
 * @route POST /api/listing-creator/media
 * @desc Update the media of a listing
 * @access Private
 */
router.post('/media', AuthMiddleware.checkBibbleTier, ListingCreatorController.updateMedia);

/**
 * @route POST /api/listing-creator/price
 * @desc Update the price of a listing
 * @access Private
 */
router.post('/price', AuthMiddleware.checkBibbleTier, ListingCreatorController.updatePrice);

/**
 * @route POST /api/listing-creator/submit
 * @desc Submit a listing
 * @access Private
 */
router.post('/submit', AuthMiddleware.checkBibbleTier, ListingCreatorController.createListing);

module.exports = router;