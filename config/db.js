// config/db.js
require('dotenv').config(); // load .env
const mysql = require ('mysql2/promise');

// parse DATABASE_URL 
const dbUrl = process.env.DATABASE_URL || '';
if(!dbUrl){
    throw new Error("DATABASE_URL belum diset di .env");
}

const url = new URL(dbUrl);

const pool = mysql.createPool({
    host: url.hostname,                         // host dari DATABASE_URL
    user: url.username,                         // user
    password: url.password,                     // password
    database: url.pathname.replace(/^\//,""),   //path tanpa leading slash => dbname
    port: url.port ? Number(url.port) : 3306,
    waitForConnections:true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;