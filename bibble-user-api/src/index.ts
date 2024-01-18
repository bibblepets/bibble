import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import Config from './config';
import { errorHandler } from './middleware/error.middleware';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import { Logger } from './services/logger';

require('./mongodb/connection');

// Express initialization
const app: Express = express();
export const { SERVER_PORT, MONGO_URI } = Config.getVars();

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
