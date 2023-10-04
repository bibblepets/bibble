import { Router } from 'express';

const AuthController = require('../controllers/auth.controller');

const router = Router();

router.get('/status', AuthController.checkAuthStatus);
router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/logout', AuthController.logoutUser);
router.put('/update/:id', AuthController.updateUser);

module.exports = router;
