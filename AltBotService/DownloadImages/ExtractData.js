const mysql = require("mysql2");
const util = require("util");
const ENV = require("dotenv");
const winston = require("winston");
const path = require("path");
ENV.config({ path: path.resolve(__dirname, "../.env") });

/* global process */

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" }),
  ],
});

/**
 * Establishes a MySQL database connection.
 * @type {mysql.Connection}
 */
const con = mysql.createConnection({
  /**
   * The hostname or IP address of the MySQL server.
   * @type {string}
   */
  host: process.env.HOSTNAME,

  /**
   * The MySQL user to authenticate as.
   * @type {string}
   */
  user: process.env.USERNAME,

  /**
   * The password of that MySQL user.
   * @type {string}
   */
  password: process.env.DBPASSWORD,

  /**
   * Name of the MySQL database to use for this connection.
   * @type {string}
   */
  database: process.env.DATABASENAME,
});

// Promisify the query function
const query = util.promisify(con.query).bind(con);

/**
 * Asynchronously retrieves data from the 'Images' table in the MySQL database.
 *
 * @async
 * @function
 * @name getDataFromDatabase
 *
 * @returns {Promise<Array>} A promise that resolves to the array of data retrieved from the 'Images' table.
 * @throws {Error} Throws an error if there is an issue in executing the query or connecting to the database.
 */
async function getDataFromDatabase() {
  try {
    const sql = "SELECT * FROM Images WHERE FLAG=0";
    const result = await query(sql);
    con.end();
    return result;
  } catch (error) {
    logger.error("Error:", error);
    con.end();
    throw error;
  }
}

module.exports = getDataFromDatabase;
