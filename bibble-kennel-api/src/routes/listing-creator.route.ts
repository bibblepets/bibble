import { Router } from 'express';
import * as ListingCreatorController from '../controllers/listing-creator.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(AuthMiddleware.authHandler);

/**
 * @route POST /listing-creator
 * @desc Create a new listing creator
 * @access Private
 */
router.post('/', ListingCreatorController.createListingCreator);

/**
 * @route POST /listing-creator/:_id
 * @desc Create a new listing
 * @access Private
 */
router.post('/:_id', ListingCreatorController.createListing);

/**
 * @route GET /listing-creator
 * @desc Get all listing creators
 * @access Private
 */
router.get('/', ListingCreatorController.getListingCreators);

/**
 * @route GET /listing-creator/:id
 * @desc Get all listing creators
 * @access Private
 */
router.get('/:_id', ListingCreatorController.getListingCreatorById);

/**
 * @route PUT /listing-creator/:id
 * @desc Update a listing creator
 * @access Private
 */
router.put('/', ListingCreatorController.updateListingCreator);

/**
 * @route PUT /listing-creator/biology
 * @desc Update a listing creator's biology info
 * @access Private
 */
router.put('/biology', ListingCreatorController.updateBiologyCreator);

/**
 * @route PUT /listing-creator/biography
 * @desc Update a listing creator's biography info
 * @access Private
 */
router.put('/biography', ListingCreatorController.updateBiographyCreator);

/**
 * @route PUT /listing-creator/medical
 * @desc Update a listing creator's medical info
 * @access Private
 */
router.put('/medical', ListingCreatorController.updateMedicalCreator);

/**
 * @route PUT /listing-creator/legal
 * @desc Update a listing creator's legal info
 * @access Private
 */
router.put('/legal', ListingCreatorController.updateLegalCreator);

/**
 * @route PUT /listing-creator/media
 * @desc Update a listing creator's media info
 * @access Private
 */
router.put(
  '/media',
  upload.array('data'),
  ListingCreatorController.updateMediaCreator
);

/**
 * @route PUT /listing-creator/price
 * @desc Update a listing creator's price info
 * @access Private
 */
router.put('/price', ListingCreatorController.updatePriceCreator);

/**
 * @route DELETE /listing-creator/:id
 * @desc Delete a listing creator
 * @access Private
 */
router.delete('/:_id', ListingCreatorController.deleteListingCreatorById);

module.exports = router;
