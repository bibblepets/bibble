import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { errorHandler } from './middleware/error.middleware';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import { Logger } from './services/logger';

dotenv.config();
require('./mongodb/connection');

// Express initialization
const app: Express = express();
const SERVER_PORT = process.env.SERVER_PORT;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);

// Error handling
app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  Logger.success(`Bibble User API is alive at http://localhost:${SERVER_PORT}`);
});
