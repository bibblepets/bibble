import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import Config from './config';
import { errorHandler } from './middleware/error.middleware';
import kennelRouter from './routes/kennel.route';
import userRouter from './routes/user.route';
import { Logger } from './services/logger';

// Express initialization
const app: Express = express();
export const { SERVER_PORT, KENNEL_API_URL, USER_API_URL, SECRET_JWT_CODE } =
  Config.getVars();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', userRouter);
app.use('/kennel', kennelRouter);

// Error handling
app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  Logger.success(`Bibble Gateway is alive at http://localhost:${SERVER_PORT}`);
});
