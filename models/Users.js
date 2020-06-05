const mongoose = require('mongoose');
// This fixed error
// (node:4592) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// By default, Mongoose 5.x calls the MongoDB driver's ensureIndex() function.
// he MongoDB driver deprecated this function in favor of createIndex().
// Set the useCreateIndex global option to opt in to making Mongoose use createIndex() instead.
// mongoose.set('useCreateIndex', true);
// ended up putting useCreateIndex: true in the db.js file

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model('user', UserSchema);
