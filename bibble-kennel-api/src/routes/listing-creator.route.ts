import { Router } from 'express';
import * as ListingCreatorController from '../controllers/listing-creator.controller';
import * as AuthMiddleware from '../middleware/auth.middleware';
import multer from 'multer';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
 * @desc Update a listing creator's biology info
 * @access Private
 */
router.post('/biology', ListingCreatorController.updateBiologyCreator);

/**
 * @route POST /listing-creator/biography
 * @desc Update a listing creator's biography info
 * @access Private
 */
router.post('/biography', ListingCreatorController.updateBiographyCreator);

/**
 * @route POST /listing-creator/medical
 * @desc Update a listing creator's medical info
 * @access Private
 */
router.post('/medical', ListingCreatorController.updateMedicalCreator);

/**
 * @route POST /listing-creator/legal
 * @desc Update a listing creator's legal info
 * @access Private
 */
router.post('/legal', ListingCreatorController.updateLegalCreator);

/**
 * @route POST /listing-creator/media
 * @desc Update a listing creator's media info
 * @access Private
 */
router.post(
  '/media',
  upload.array('data'),
  ListingCreatorController.updateMediaCreator
);

/**
 * @route POST /listing-creator/price
 * @desc Update a listing creator's price info
 * @access Private
 */

module.exports = router;
