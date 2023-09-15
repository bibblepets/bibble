import { Router } from 'express';

const AuthController = require('../controllers/auth.controller');

const router = Router();

router.get('/status', AuthController.checkAuthStatus);
router.post('/authenticate', AuthController.authenticateUser);
router.post('/logout', AuthController.logoutUser);

module.exports = router;
