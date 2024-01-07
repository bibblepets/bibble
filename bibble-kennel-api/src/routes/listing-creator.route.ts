import { Router } from 'express';
import * as ListingCreatorController from '../controllers/listing-creator.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';

const router = Router();

router.use(AuthMiddleware.authHandler);

/**
 * @route POST /listing-creator
 * @desc Create a new listing creator
 * @access Private
 */
router.post('/', ListingCreatorController.createListingCreator);

module.exports = router;
