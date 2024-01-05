import { Router } from 'express';
import multer from 'multer';
import * as ListingCreatorController from '../controllers/listing-creator.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(AuthMiddleware.checkAuth, AuthMiddleware.validateBibbleTier);

/**
 * @route GET /kennel/listing-creator/self
 * @desc Get all listing creators
 * @access Private
 */
router.get('/self', ListingCreatorController.getMyListingCreators);

/**
 * @route GET /kennel/listing-creator/:id
 * @desc Get a listing creator by ID
 * @access Private
 */
router.get('/:id', ListingCreatorController.getListingCreatorById);

/**
 * @route POST /kennel/listing-creator
 * @desc Create a new listing
 * @access Private
 */
router.post('/', ListingCreatorController.createListingCreator);

/**
 * @route PUT /kennel/listing-creator/:id
 * @desc Update a listing creator
 * @access Private
 */
router.put('/:id', ListingCreatorController.updateListingCreatorById);

/**
 * @route POST /kennel/listing-creator/biology
 * @desc Update the biology of a listing
 * @access Private
 */
router.post('/biology', ListingCreatorController.updateBiology);

/**
 * @route POST /kennel/listing-creator/biography
 * @desc Update the biography of a listing
 * @access Private
 */
router.post('/biography', ListingCreatorController.updateBiography);

/**
 * @route POST /kennel/listing-creator/medical
 * @desc Update the medical of a listing
 * @access Private
 */
router.post('/medical', ListingCreatorController.updateMedical);

/**
 * @route POST /kennel/listing-creator/legal
 * @desc Update the legal of a listing
 * @access Private
 */
router.post('/legal', ListingCreatorController.updateLegal);

/**
 * @route POST /kennel/listing-creator/media
 * @desc Update the media of a listing
 * @access Private
 */
router.post(
  '/media',
  upload.array('data'),
  ListingCreatorController.updateMedia
);

/**
 * @route POST /kennel/listing-creator/price
 * @desc Update the price of a listing
 * @access Private
 */
router.post('/price', ListingCreatorController.updatePrice);

/**
 * @route POST /kennel/listing-creator/submit
 * @desc Submit a listing
 * @access Private
 */
router.post('/submit', ListingCreatorController.createListing);

/**
 * @route DELETE /kennel/listing-creator/:id
 * @desc Delete a listing creator by ID
 * @access Private
 */
router.delete('/:id', ListingCreatorController.deleteListingCreatorById);

module.exports = router;
