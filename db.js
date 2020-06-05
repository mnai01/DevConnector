const mongoose = require('mongoose');
// packed used to get info from a config file
const config = require('config');
// holds our key
const db = config.get('mongoURI');

// returns a promise
// using an async await
// most of the time async await functions require a try catch
const connectDB = async () => {
  try {
    // since this returns a promise we want to put await here
    // the code after the await function will get executed
    // once the promise is returned
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Mongo DB connected');
  } catch (err) {
    console.log(err.message);
    // Exit the process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
