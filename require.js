var pg = require('pg'),
  db_secret = require('./db_secret.js'),
  db = new db_secret();

var config = {
  user: db.user,
  database: db.name,
  password: db.password,
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};

var pool = new pg.Pool(config);
module.exports = pool;
