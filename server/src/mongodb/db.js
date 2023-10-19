const mongoose = require('mongoose');

let database;
if (process.env.NODE_ENV === 'testing') {
  database = process.env.MONGO_URI_TEST;
} else {
  database = process.env.MONGO_URI;
}

mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    if (process.env.NODE_ENV === 'testing') {
      console.log('    MongoDB connection successful (testing)');
    } else {
      console.log('    MongoDB connection successful');
    }
  })
  .catch((error) => {
    console.error('Connection error', error.message);
  });

const db = mongoose.connection;

module.exports = db;
