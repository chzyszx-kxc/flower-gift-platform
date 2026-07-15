require('dotenv').config();
var mysql = require('mysql2');

var db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'database_for_flowers'
});

db.connect(function(err) {
    if (err) {
        console.error('[query] - :' + err);
    }
    console.log('MySQL数据库连接成功')
});

module.exports = db;
