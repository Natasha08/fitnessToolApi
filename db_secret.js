function db_secret() {
  var db = {};
  db.user = 'tulsi';
  db.password = 'purple';
  db.name = '';
  db.host = 'localhost';
  db.max = 10;
  db.idleTimeoutMillis = 30000;

  return db;
}

module.exports = db_secret;
