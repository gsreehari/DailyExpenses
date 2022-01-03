const { createPool } = require("mysql");

const pool = createPool({
    // host: process.env.PRODUCTION ? process.env.MYSQL_HOST1 : process.env.MYSQL_HOST,
    // user: process.env.PRODUCTION ? process.env.MYSQL_USER1 : process.env.MYSQL_USER,
    // password: process.env.PRODUCTION ? process.env.MYSQL_PASSWORD1 : process.env.MYSQL_PASSWORD,
    // database: process.env.PRODUCTION ? process.env.MYSQL_DATABASE1 : process.env.MYSQL_DATABASE,

    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
});



module.exports = pool;