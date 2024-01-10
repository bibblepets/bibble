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

/**
 * @route GET /listing/me
 * @desc Get all listings
 */
router.get('/me', AuthMiddleware.authHandler, ListingController.getMyListings);

module.exports = router;
