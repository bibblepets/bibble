import { Router } from 'express';
import * as ListingController from '../controllers/listing.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route GET /listing
 * @desc Get all listings or listings by query
 * @access Public
 */
router.get('/', ListingController.getListings);

router.use(AuthMiddleware.authHandler);

/**
 * @route GET /listing/me
 * @desc Get all listings
 * @access Private
 */
router.get('/me', ListingController.getMyListings);

/**
 * @route GET /listing/:_id
 * @desc Get listing by id
 * @access Public
 */
router.get('/:_id', ListingController.getListingById);

/**
 * @route PUT /listing
 * @desc Update a listing
 * @access Private
 */
router.put('/', ListingController.updateListing);

/**
 * @route PUT /listing/media
 * @desc Update a listing's media
 * @access Private
 */
router.put(
  '/media',
  upload.array('media'),
  ListingController.updateListingMedia
);

module.exports = router;
