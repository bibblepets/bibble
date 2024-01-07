import { Router } from 'express';
import * as LegalTagController from '../controllers/legal-tag.controller';

const router = Router();

/**
 * @route GET /legal-tag
 * @desc Get all legal tags or legal tags by query
 * @access Public
 */
router.get('/', LegalTagController.getLegalTags);

module.exports = router;
