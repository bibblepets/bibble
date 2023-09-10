import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

import userRoutes from './routes/users';

dotenv.config();

const app: Express = express();
const port = process.env.SERVER_PORT;

app.get('/api', (req: Request, res: Response) => {
	res.send('from Server!');
});

app.use('/api/users', userRoutes);

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
