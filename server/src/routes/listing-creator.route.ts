import { Router } from 'express';
import multer from 'multer';
import * as ListingCreatorController from '../controllers/listing-creator.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(
  AuthMiddleware.getUserFromAuthToken,
  AuthMiddleware.validateBibbleTier
);

/**
 * @route GET /api/listing-creator/self
 * @desc Get all listing creators
 * @access Private
 */
router.get('/self', ListingCreatorController.getMyListingCreators);

/**
 * @route GET /api/listing-creator/:id
 * @desc Get a listing creator by ID
 * @access Private
 */
router.get('/:id', ListingCreatorController.getListingCreatorById);

/**
 * @route POST /api/listing-creator
 * @desc Create a new listing
 * @access Private
 */
router.post('/', ListingCreatorController.createListingCreator);

/**
 * @route POST /api/listing-creator/update
 * @desc Update a listing creator
 * @access Private
 */
router.post('/update', ListingCreatorController.updateListingCreatorById);

/**
 * @route POST /api/listing-creator/biology
 * @desc Update the biology of a listing
 * @access Private
 */
router.post('/biology', ListingCreatorController.updateBiology);

/**
 * @route POST /api/listing-creator/biography
 * @desc Update the biography of a listing
 * @access Private
 */
router.post('/biography', ListingCreatorController.updateBiography);

/**
 * @route POST /api/listing-creator/medical
 * @desc Update the medical of a listing
 * @access Private
 */
router.post('/medical', ListingCreatorController.updateMedical);

/**
 * @route POST /api/listing-creator/legal
 * @desc Update the legal of a listing
 * @access Private
 */
router.post('/legal', ListingCreatorController.updateLegal);

/**
 * @route POST /api/listing-creator/media
 * @desc Update the media of a listing
 * @access Private
 */
router.post(
  '/media',
  upload.array('media'),
  ListingCreatorController.updateMedia
);

/**
 * @route POST /api/listing-creator/price
 * @desc Update the price of a listing
 * @access Private
 */
router.post('/price', ListingCreatorController.updatePrice);

/**
 * @route POST /api/listing-creator/submit
 * @desc Submit a listing
 * @access Private
 */
router.post('/submit', ListingCreatorController.createListing);

module.exports = router;
