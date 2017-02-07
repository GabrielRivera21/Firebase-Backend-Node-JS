var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var nconf = require('nconf');
nconf.env().file({ file: __dirname + '/../config/config.json' });

var username = nconf.get('POSTGRES_USER');
var password = nconf.get('POSTGRES_PASSWORD');
var database = nconf.get('POSTGRES_DATABASE');
var host = nconf.get('POSTGRES_HOST');
var port = nconf.get('POSTGRES_PORT');
var dialect = 'postgres';

var sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        encrypt: true,
        requestTimeout: 50000
    },
    port: port
});

var db = {};

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
})
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
