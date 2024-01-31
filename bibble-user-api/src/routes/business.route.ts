import { Router } from 'express';
import multer from 'multer';
import * as BusinessController from '../controllers/business.controller';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @route GET /business/:businessId
 * @desc Get business profile
 * @access Public
 */
router.get('/:businessId', BusinessController.getBusiness);

/**
 * @route PUT /business/:businessId
 * @desc Update business profile
 * @access Private
 */
router.put('/:businessId', BusinessController.updateBusiness);

/**
 * @route PUT /business/media/:businessId
 * @desc Update business media
 * @access Private
 */
router.put(
  '/media/:businessId',
  upload.array('data'),
  BusinessController.updateBusinessMedia
);

export default router;
