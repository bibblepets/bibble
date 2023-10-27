const mongoose = require('mongoose');

const connectionString = process.env.MONGO_URI;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connection successful');
  })
  .catch((error) => {
    console.error('Connection error', error.message);
  });

const connection = mongoose.connection;

module.exports = connection;
