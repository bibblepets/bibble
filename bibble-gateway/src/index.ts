import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { configHandler } from './middleware/config.middleware';
import { errorHandler } from './middleware/error.middleware';
import kennelRouter from './routes/kennel.route';
import userRouter from './routes/user.route';
import { Logger } from './services/logger';

dotenv.config();

// Express initialization
const app: Express = express();
const SERVER_PORT = process.env.SERVER_PORT;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(configHandler);

// Routes
app.use('/user', userRouter);
app.use('/kennel', kennelRouter);

// Error handling
app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  Logger.success(`Bibble Gateway is alive at http://localhost:${SERVER_PORT}`);
});
