const mysql = require('mysql');
require('dotenv').config();

const connectDB = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  connection.connect((err) => {
    if (err) {
      console.error('MySQL Database connection FAIL');
      throw err;
    }
    console.log('MySQL Database connection SUCCESS');
  });

  return connection;
};


module.exports = { connectDB }
