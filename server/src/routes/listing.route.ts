import { Router } from 'express';
import * as ListingController from '../controllers/listing.controller';

const router = Router();

/**
 * @route POST /api/listings
 * @desc Create a new listing
 * @access Private
 */
router.post('/', ListingController.createListing);

/**
 * @route GET /api/listings
 * @desc Get all listings
 * @access Public
 */
router.get('/', ListingController.getAllListings);

/**
 * @route GET /api/listings/species/:species
 * @desc Get all listings for a specific species
 * @access Public
 */
router.get('/species/:species', ListingController.getAllListingsBySpecies);

/**
 * @route GET /api/listings/:id
 * @desc Get a listing by ID
 * @access Public
 */
router.get('/:id', ListingController.getListingById);

/**
 * @route PUT /api/listings/:id
 * @desc Update a listing by ID
 * @access Private
 */
router.put('/:id', ListingController.updateListingById);

/**
 * @route DELETE /api/listings/:id
 * @desc Delete a listing by ID
 * @access Private
 */
router.delete('/:id', ListingController.deleteListingById);

module.exports = router;
