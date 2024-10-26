// backend/db.js
const mysql = require('mysql');

const databaseConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'nehal',
    database: 'my_database'
});

module.exports = databaseConnection;
