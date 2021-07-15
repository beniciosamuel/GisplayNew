const mongoose = require('mongoose');

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;
const string = 'mongodb://' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME;

mongoose.connect(string, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;
