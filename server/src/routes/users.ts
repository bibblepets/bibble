import { Request, Response, Router } from 'express';

const mongoose = require('mongoose');
const User = require('../models/user');

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json('from Users!');
});

router.get('/currentUser', (req: Request, res: Response) => {
  res.json({
    id: '1234',
    name: 'John Doe',
    email: 'john@email.com'
  });
});

export default router;
