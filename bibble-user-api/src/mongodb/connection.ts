import mongoose, { Connection } from 'mongoose';
import { Logger } from '../services/logger';

let database: string | undefined;
if (process.env.NODE_ENV === 'testing') {
  database = process.env.MONGO_URI_TEST;
} else {
  database = process.env.MONGO_URI;
}

if (!database) {
  throw new Error('Database URI must be defined');
}

mongoose
  .connect(database)
  .then(() => {
    if (process.env.NODE_ENV !== 'testing') {
      Logger.success('MongoDB connection successful');
    }
  })
  .catch((error: Error) => {
    Logger.fail(error);
  });

const connection: Connection = mongoose.connection;

export default connection;
