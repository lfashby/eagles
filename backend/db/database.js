//creates database to store data
//tables and related data will be under this database name;

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var learndb = mongoose.connection;
learndb.on('error', console.error.bind(console, 'db:line7:Kai needs to fix something probably'));
learndb.once('open', function() {
  console.log('Nice job connecting to the server Kai');
})
// mongoose.connect('mongodb://test:test@ds139904.mlab.com:39904/eagles');

mongoose.connect('mongodb://learning:learn@ds259325.mlab.com:59325/learning');

module.exports = learndb;