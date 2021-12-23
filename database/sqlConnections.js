var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mohammad',
    database: 'mydb'
})

module.exports = connection;