import { Router } from 'express';
import multer from 'multer';
import * as ListingCreatorController from '../controllers/listing-creator.controller';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route POST /listing-creator
 * @desc Create a new listing creator
 * @access Public
 */
router.post('/', ListingCreatorController.createListingCreator);

/**
 * @route POST /listing-creator/:_id
 * @desc Create a new listing
 * @access Public
 */
router.post('/:_id', ListingCreatorController.createListing);

/**
 * @route GET /listing-creator/me
 * @desc Get my listing creators
 * @access Public
 */
router.get('/me', ListingCreatorController.getMyListingCreators);

/**
 * @route GET /listing-creator/:id
 * @desc Get all listing creators
 * @access Public
 */
router.get('/:_id', ListingCreatorController.getListingCreatorById);

/**
 * @route PUT /listing-creator/:id
 * @desc Update a listing creator
 * @access Public
 */
router.put('/:_id', ListingCreatorController.updateListingCreator);

/**
 * @route PUT /listing-creator/biology/:_id
 * @desc Update a listing creator's biology info
 * @access Public
 */
router.put('/biology/:_id', ListingCreatorController.updateBiologyCreator);

/**
 * @route PUT /listing-creator/biography/:_id
 * @desc Update a listing creator's biography info
 * @access Public
 */
router.put('/biography/:_id', ListingCreatorController.updateBiographyCreator);

/**
 * @route PUT /listing-creator/medical/:_id
 * @desc Update a listing creator's medical info
 * @access Public
 */
router.put('/medical/:_id', ListingCreatorController.updateMedicalCreator);

/**
 * @route PUT /listing-creator/legal/:_id
 * @desc Update a listing creator's legal info
 * @access Public
 */
router.put('/legal/:_id', ListingCreatorController.updateLegalCreator);

/**
 * @route PUT /listing-creator/media/:_id
 * @desc Update a listing creator's media info
 * @access Public
 */
router.put(
  '/media/:_id',
  upload.array('data'),
  ListingCreatorController.updateMediaCreator
);

/**
 * @route PUT /listing-creator/price/:_id
 * @desc Update a listing creator's price info
 * @access Public
 */
router.put('/price/:_id', ListingCreatorController.updatePriceCreator);

/**
 * @route DELETE /listing-creator/:id
 * @desc Delete a listing creator
 * @access Public
 */
router.delete('/:_id', ListingCreatorController.deleteListingCreatorById);

export default router;
