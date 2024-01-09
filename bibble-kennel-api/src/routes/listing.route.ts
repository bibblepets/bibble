import { Router } from 'express';
import * as ListingController from '../controllers/listing.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route GET /listing
 * @desc Get all listings
 */
router.get('/me', AuthMiddleware.authHandler, ListingController.getMyListings);

module.exports = router;
