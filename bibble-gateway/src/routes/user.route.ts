import { Router } from 'express';
import multer from 'multer';
import * as AuthMiddleware from '../middleware/auth.middleware';
// import * as UserController from '../controllers/user.controller';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', AuthMiddleware.authHandler, (req, res) => {
  res.send('Hello world');
});

module.exports = router;
