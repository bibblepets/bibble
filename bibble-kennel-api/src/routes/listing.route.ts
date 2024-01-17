import { Router } from 'express';
import multer from 'multer';
import * as ListingController from '../controllers/listing.controller';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route GET /listing
 * @desc Get all listings or listings by query
 * @access Public
 */
router.get('/', ListingController.getListings);

/**
 * @route GET /listing/me
 * @desc Get all listings
 * @access Public
 */
router.get('/me', ListingController.getMyListings);

/**
 * @route GET /listing/:_id
 * @desc Get listing by id
 * @access Public
 */
router.get('/:_id', ListingController.getListingById);

/**
 * @route PUT /listing/:_id
 * @desc Update a listing
 * @access Public
 */
router.put('/:_id', ListingController.updateListing);

/**
 * @route PUT /listing/media/:_id
 * @desc Update a listing's media
 * @access Public
 */
router.put(
  '/media/:_id',
  upload.array('data'),
  ListingController.updateListingMedia
);

export default router;
