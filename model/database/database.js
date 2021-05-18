require("dotenv").config();
const pg = require("pg");
const Pool = pg.Pool;
const {credentials} = require("../../config.json");

module.exports = new Pool({
	connectionString: `postgresql://${credentials.username}:${credentials.dbPassword}@${credentials.dbHost}:${credentials.dbPort}/${credentials.database}`
});
