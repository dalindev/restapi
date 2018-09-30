// config/database.js
var config = require('./conf.json')

module.exports = {
  'connection': {
    'host': config.dbHost,
    'user': config.dbUser,
    'password': config.dbPassword,
    'database': config.dbDatabase
  },
  'database': config.dbDatabase
}
