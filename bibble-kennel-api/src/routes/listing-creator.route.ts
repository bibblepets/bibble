import { Router } from 'express';
import * as ListingCreatorController from '../controllers/listing-creator.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';

const router = Router();

router.use(AuthMiddleware.authHandler);

/**
 * @route GET /listing-creator/:id
 * @desc Get all listing creators
 * @access Private
 */
router.get('/:id', ListingCreatorController.getListingCreatorById);

/**
 * @route POST /listing-creator
 * @desc Create a new listing creator
 * @access Private
 */
router.post('/', ListingCreatorController.createListingCreator);

/**
 * @route POST /listing-creator/biology
 * @desc Update a listing creator's biology
 * @access Private
 */
router.post('/biology', ListingCreatorController.updateBiologyCreator);

module.exports = router;
