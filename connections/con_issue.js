const mongoose = require('mongoose');

// [MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if 
// you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.
mongoose.set("strictQuery", false);

/* See: https://mongoosejs.com/docs/connections.html#multiple_connections */

const conn = mongoose.createConnection(process.env.ISSUE_TRACKER_MONGO_URI, () => {
    return console.log('Connected to MongoDB on Issue Tracker')
});

module.exports = conn;