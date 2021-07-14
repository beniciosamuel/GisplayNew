const mongoose = require('mongoose');

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

mongoose.connect('mongodb://localhost/noderest', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;